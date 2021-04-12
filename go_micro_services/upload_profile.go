package main

import(
	//Native Go Packages
	"io"
	"os"
	"log"
	"fmt"
	"flag"
	"time"
	"net/http"
	"path/filepath"
	
	//3rd Party
	"github.com/rs/cors"
)

var addr = flag.String("addr", "0.0.0.0:4500", "Http Serverice Address")

const MAX_UPLOAD_SIZE = 1024 * 1024 //1MB

type Progress struct {
	TotalSize int64
	BytesRead int64
}

func (pr *Progress) Print() {
	if pr.BytesRead == pr.TotalSize {
		fmt.Println("Done...")
		return
	}
	
	fmt.Printf("File upload in progress: %d \n", pr.BytesRead)
}

//implements the io.Writer interface
func (pr *Progress) Write(p []byte) (n int, err error) {
	n, err = len(p), nil
	pr.BytesRead += int64(n)
	pr.Print()
	return
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	//32MB dfault FormFile
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return 
	}
	
	files := r.MultipartForm.File["file"]
	fmt.Println(files)
	
	
	for _, fileHeader := range files {
		if fileHeader.Size > MAX_UPLOAD_SIZE {
			http.Error(w, fmt.Sprintf("The uploaded image is too big: %s. Please use an image less than 1MB in size", fileHeader.Filename), http.StatusBadRequest)
			return
		}	
		
		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		defer file.Close() //when current functional execution done do this... close file 
		
		buff := make([]byte, 512)
		_, err = file.Read(buff)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		fileType := http.DetectContentType(buff)
		if fileType != "image/jpeg" && fileType != "image/png" {
			http.Error(w, "The provided file format is not allowed. Please upload a JPEG or PNG image", http.StatusBadRequest)
			return 
		}
		
		_, err = file.Seek(0, io.SeekStart)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		// /var/www/parcel_blueprint/dist/uploads/profile_pictures/
		err = os.MkdirAll("/var/www/parcel_blueprint/dist/uploads/profile_pictures/", os.ModePerm)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		f, err := os.Create(fmt.Sprintf("/var/www/parcel_blueprint/dist/uploads/profile_pictures/%d%s", time.Now().UnixNano(), filepath.Ext(fileHeader.Filename)))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		
		defer f.Close()
		
		
		pr := &Progress {
			TotalSize: fileHeader.Size,
		}
		
		//Actual Copy Data to new File 
		_, err = io.Copy(f, io.TeeReader(file, pr))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	}

	fmt.Fprintf(w, "{\"message\": \"Upload successful\"}")
}

func main() {
	mux := http.NewServeMux()
	
	mux.HandleFunc("/upload", uploadHandler)
	
	
	handler := cors.Default().Handler(mux)
	fmt.Println("Starting Server on Port => 4500")
	if err := http.ListenAndServeTLS(*addr, "/etc/letsencrypt/live/var.pr0con.com/cert.pem", "/etc/letsencrypt/live/var.pr0con.com/privkey.pem", handler); err != nil {
		log.Fatal(err)
	}
}





