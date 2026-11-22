package main

import (
	"context"
	"encoding/json"
	"flag"
	"io"
	"log"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"
	"time"
)

var (
	startTime  = time.Now()
	yangonZone = time.FixedZone("MMT", 6*3600+30*60)
)

func init() {
	// Register MIME types explicitly so scratch containers (without /etc/mime.types)
	// serve fonts, PDFs, DOCX, XML, and plain-text endpoints with exact headers.
	types := map[string]string{
		".html":  "text/html; charset=utf-8",
		".css":   "text/css; charset=utf-8",
		".js":    "application/javascript; charset=utf-8",
		".mjs":   "application/javascript; charset=utf-8",
		".json":  "application/json; charset=utf-8",
		".txt":   "text/plain; charset=utf-8",
		".xml":   "application/xml; charset=utf-8",
		".svg":   "image/svg+xml",
		".png":   "image/png",
		".jpg":   "image/jpeg",
		".jpeg":  "image/jpeg",
		".webp":  "image/webp",
		".avif":  "image/avif",
		".ico":   "image/x-icon",
		".pdf":   "application/pdf",
		".docx":  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		".woff2": "font/woff2",
		".woff":  "font/woff",
		".map":   "application/json; charset=utf-8",
	}
	for ext, ctype := range types {
		_ = mime.AddExtensionType(ext, ctype)
	}
}

func envOrDefault(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

func runHealthcheck(port string) int {
	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get("http://127.0.0.1:" + port + "/api/status")
	if err != nil {
		return 1
	}
	defer resp.Body.Close()
	_, _ = io.Copy(io.Discard, resp.Body)
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return 0
	}
	return 1
}

func loadBaseStatus(outDir string) map[string]any {
	raw, err := os.ReadFile(filepath.Join(outDir, "api", "status"))
	if err != nil {
		return map[string]any{
			"status":  "operational",
			"service": "thutasitt.dev",
		}
	}
	var parsed map[string]any
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return map[string]any{
			"status":  "operational",
			"service": "thutasitt.dev",
		}
	}
	return parsed
}

func cloneShallowMap(src map[string]any) map[string]any {
	dst := make(map[string]any, len(src))
	for k, v := range src {
		dst[k] = v
	}
	return dst
}

func handleStatus(base map[string]any) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", "GET, HEAD")
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		now := time.Now()
		payload := cloneShallowMap(base)
		payload["status"] = "operational"
		payload["timestamp"] = now.UTC().Format(time.RFC3339Nano)
		payload["uptimeSeconds"] = int64(time.Since(startTime).Seconds())

		if engRaw, ok := base["engineer"].(map[string]any); ok {
			eng := cloneShallowMap(engRaw)
			eng["yangonTime"] = now.In(yangonZone).Format("02/01/2006, 15:04:05")
			payload["engineer"] = eng
		}

		rt := map[string]any{
			"server":           "Go",
			"go":               runtime.Version(),
			"framework":        "Next.js 15 Static Export + Go",
			"zeroBaas":         true,
			"designPreference": "Dark-mode-first aesthetic",
		}
		if rtRaw, ok := base["runtime"].(map[string]any); ok {
			merged := cloneShallowMap(rtRaw)
			delete(merged, "node")
			merged["server"] = "Go"
			merged["go"] = runtime.Version()
			merged["framework"] = "Next.js 15 Static Export + Go"
			rt = merged
		}
		payload["runtime"] = rt

		body, err := json.Marshal(payload)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store, max-age=0")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.WriteHeader(http.StatusOK)
		if r.Method == http.MethodGet {
			_, _ = w.Write(body)
		}
	}
}

func isRegularFile(p string) bool {
	info, err := os.Stat(p)
	return err == nil && !info.IsDir()
}

func resolveStaticFile(outAbs, urlPath string) (string, bool) {
	cleaned := path.Clean("/" + urlPath)
	rel := strings.TrimPrefix(cleaned, "/")

	if rel == "" {
		indexPath := filepath.Join(outAbs, "index.html")
		return indexPath, isRegularFile(indexPath)
	}

	candidate := filepath.Join(outAbs, filepath.FromSlash(rel))
	if candidate != outAbs && !strings.HasPrefix(candidate, outAbs+string(filepath.Separator)) {
		return "", false
	}

	if isRegularFile(candidate) {
		return candidate, true
	}

	if info, err := os.Stat(candidate); err == nil && info.IsDir() {
		dirIndex := filepath.Join(candidate, "index.html")
		if isRegularFile(dirIndex) {
			return dirIndex, true
		}
	}

	htmlCandidate := candidate + ".html"
	if isRegularFile(htmlCandidate) {
		return htmlCandidate, true
	}

	return "", false
}

func setSecurityAndCacheHeaders(w http.ResponseWriter, urlPath, filePath string) {
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Frame-Options", "SAMEORIGIN")
	w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

	if ctype := mime.TypeByExtension(filepath.Ext(filePath)); ctype != "" {
		w.Header().Set("Content-Type", ctype)
	}

	switch {
	case strings.HasPrefix(urlPath, "/_next/static/"):
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	case strings.HasPrefix(urlPath, "/certificates/"),
		strings.HasPrefix(urlPath, "/spherex-previews/"):
		w.Header().Set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400")
	case strings.HasPrefix(urlPath, "/cv/"),
		strings.HasPrefix(urlPath, "/images/"):
		w.Header().Set("Cache-Control", "public, max-age=86400")
	case strings.HasSuffix(filePath, ".html"):
		w.Header().Set("Cache-Control", "public, max-age=0, must-revalidate")
	default:
		w.Header().Set("Cache-Control", "public, max-age=3600")
	}
}

func handleStatic(outAbs string) http.HandlerFunc {
	notFoundPath := filepath.Join(outAbs, "404.html")

	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", "GET, HEAD")
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
			return
		}

		filePath, ok := resolveStaticFile(outAbs, r.URL.Path)
		if !ok {
			w.Header().Set("X-Content-Type-Options", "nosniff")
			w.Header().Set("X-Frame-Options", "SAMEORIGIN")
			w.Header().Set("Cache-Control", "no-store")
			if data, err := os.ReadFile(notFoundPath); err == nil {
				w.Header().Set("Content-Type", "text/html; charset=utf-8")
				w.WriteHeader(http.StatusNotFound)
				if r.Method == http.MethodGet {
					_, _ = w.Write(data)
				}
				return
			}
			http.NotFound(w, r)
			return
		}

		f, err := os.Open(filePath)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		defer f.Close()

		info, err := f.Stat()
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		setSecurityAndCacheHeaders(w, r.URL.Path, filePath)
		http.ServeContent(w, r, filepath.Base(filePath), info.ModTime(), f)
	}
}

func main() {
	healthcheck := flag.Bool("healthcheck", false, "Check local /api/status health")
	flag.Parse()

	port := envOrDefault("PORT", "3000")
	if *healthcheck {
		os.Exit(runHealthcheck(port))
	}

	outDir := envOrDefault("OUT_DIR", "/app/out")
	outAbs, err := filepath.Abs(outDir)
	if err != nil {
		log.Fatalf("invalid OUT_DIR %q: %v", outDir, err)
	}

	baseStatus := loadBaseStatus(outAbs)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/status", handleStatus(baseStatus))
	mux.HandleFunc("/", handleStatic(outAbs))

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("portfolio Go static+status server listening on :%s serving %s", port, outAbs)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}
