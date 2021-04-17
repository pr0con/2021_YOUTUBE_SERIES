package main

import(
	"log"
	"fmt"
	"flag"
	"net/http"
	
	"go_micro_services/procon_gin"
	"go_micro_services/procon_data"
)

var addr = flag.String("addr", "0.0.0.0:1300", "Gin Rest Services")

func main() {
	procon_data.StartMongo()
	
	fmt.Println("Go Gin / With Mongo Server Running : 1300")
	if err := http.ListenAndServeTLS(*addr, "/etc/letsencrypt/live/var.pr0con.com/cert.pem", "/etc/letsencrypt/live/var.pr0con.com/privkey.pem", procon_gin.Router); err != nil {
		log.Fatal(err)
	}
}