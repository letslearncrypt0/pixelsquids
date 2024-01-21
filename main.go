package main

import (
	"embed"
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"strings"
)

//go:embed images/*/*.png
var content embed.FS

func getAllFilenames(efs *embed.FS) (files []string, err error) {
	if err := fs.WalkDir(efs, ".", func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {
			return nil
		}

		files = append(files, path)

		return nil
	}); err != nil {
		return nil, err
	}

	return files, nil
}

func main() {
	files, err := getAllFilenames(&content)

	if err != nil {
		slog.Error("Error getting all files", err)
		os.Exit(1)
	}
	attributes := make(map[string][]string)

	for _, file := range files {
		f := strings.TrimSuffix(strings.TrimPrefix(file, "images/"), ".png")
		fmt.Println(f)
		parts := strings.Split(f, "/")
		if len(parts) != 2 {
			continue
		}
		options, ok := attributes[parts[0]]
		if !ok {
			options = make([]string, 0)
		}
		attributes[parts[0]] = append(options, parts[1])
	}
	http.HandleFunc("/share", func(w http.ResponseWriter, r *http.Request) {
		background := strings.ReplaceAll(r.URL.Query().Get("background"), "%20", " ")
		body := strings.ReplaceAll(strings.TrimSpace(r.URL.Query().Get("body")), "%20", " ")
		eyes := strings.ReplaceAll(strings.TrimSpace(r.URL.Query().Get("eyes")), "%20", " ")
		mouth := strings.ReplaceAll(strings.TrimSpace(r.URL.Query().Get("mouth")), "%20", " ")
		generateURL := fmt.Sprintf("https://%s/generate?background=%s&body=%s&eyes=%s&mouth=%s", r.Host, background, body, eyes, mouth)
		w.Write([]byte(fmt.Sprintf(`<html>
			<head>
				<title>Pixel Squid Generator</title>
				<meta name="twitter:card" content="summary_large_image">
				<meta name="twitter:site" content="@pixelsquids">
				<meta name="twitter:title" content="PixelSquid Generator">
				<meta name="twitter:description" content="PixelSquid">
				<meta name="twitter:creator" content="@pixelsquids">
				<meta name="twitter:image" content="%s">
				<meta name="twitter:domain" content="https://pixelsquids.ink/">
				<script>
					window.location.href = "https://pixelsquids.ink/build.html";
				</script>
			<head>
		</html>`, generateURL)))
		w.Header().Set("Content-Type", "text/html")
	})
	http.HandleFunc("/generate", func(w http.ResponseWriter, r *http.Request) {
		background := strings.ReplaceAll(r.URL.Query().Get("background"), "%20", " ")
		body := strings.ReplaceAll(strings.TrimSpace(r.URL.Query().Get("body")), "%20", " ")
		eyes := strings.ReplaceAll(strings.TrimSpace(r.URL.Query().Get("eyes")), "%20", " ")
		mouth := strings.ReplaceAll(strings.TrimSpace(r.URL.Query().Get("mouth")), "%20", " ")
		// default background
		if background == "" {
			background = "Celadon"
		}

		backgroundImage, err := openPNG(fmt.Sprintf("images/background/%s.png", background))
		if err != nil {
			slog.Error("Error opening background image", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		combinedImage := image.NewRGBA(backgroundImage.Bounds())
		if background != "" {
			backgroundImage, err := openPNG(fmt.Sprintf("images/background/%s.png", background))
			if err != nil {
				slog.Error("Error opening body image", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			draw.Draw(combinedImage, combinedImage.Bounds(), backgroundImage, image.Point{}, draw.Over)
		}

		if body != "" {
			bodyImage, err := openPNG(fmt.Sprintf("images/body/%s.png", body))
			if err != nil {
				slog.Error("Error opening body image", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			draw.Draw(combinedImage, combinedImage.Bounds(), bodyImage, image.Point{}, draw.Over)
		}

		if mouth != "" {
			mouthImage, err := openPNG(fmt.Sprintf("images/mouth/%s.png", mouth))
			if err != nil {
				slog.Error("Error opening mouth image", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			draw.Draw(combinedImage, combinedImage.Bounds(), mouthImage, image.Point{}, draw.Over)
		}

		if eyes != "" {
			eyesImage, err := openPNG(fmt.Sprintf("images/eyes/%s.png", eyes))
			if err != nil {
				slog.Error("Error opening eyes image", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			draw.Draw(combinedImage, combinedImage.Bounds(), eyesImage, image.Point{}, draw.Over)
		}

		w.Header().Set("Content-Type", "image/png")
		err = png.Encode(w, combinedImage)
		if err != nil {
			slog.Error("Error encoding image", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	})

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		slog.Error("Error starting server", err)
		os.Exit(1)
	}

}

// openPNG opens a PNG file and returns the image.Image
func openPNG(filename string) (image.Image, error) {
	file, err := content.Open(filename)
	if err != nil {

		return nil, err
	}
	defer file.Close()
	img, _, err := image.Decode(file)
	if err != nil {
		return nil, err
	}
	return img, nil
}
