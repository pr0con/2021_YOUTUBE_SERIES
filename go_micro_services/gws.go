package main

import(
	"log"
	"fmt"
	"flag"
	"net/http"
	"encoding/json"
	
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"	
	
	"go_micro_services/procon_data"
)

var addr = flag.String("addr", "0.0.0.0:1200", "Ws Service Address")

func handleAPI(w http.ResponseWriter, r *http.Request) {
	conn, _, _, err := ws.UpgradeHTTP(r, w)
	if err != nil {
		// handle error
	}
	
	go func() {
		defer conn.Close()
		
		r := wsutil.NewReader(conn, ws.StateServerSide)
		w := wsutil.NewWriter(conn, ws.StateServerSide, ws.OpText)
		decoder := json.NewDecoder(r)
		encoder := json.NewEncoder(w)		
		
		LOOP:
			for {
				hdr, err := r.NextFrame()
				if err != nil {
					fmt.Println( err )
					break LOOP
				}	

				if hdr.OpCode == ws.OpClose {
					break LOOP
				}
				
				in := procon_data.Msg{}
				if err := decoder.Decode(&in); err != nil {
					fmt.Println(err)
					break LOOP
				}
				
				
				fmt.Println(in)
				resp := procon_data.RespMsg{Type: "System Message", Success: "true", Data: "Hello World"}
				
				if err := encoder.Encode(&resp); err != nil {
					fmt.Println( err )
				}
				
				if err = w.Flush(); err != nil {
					fmt.Println( err )
				}
			}
	}()
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handleAPI)
	
	//Test Starting / Accessing Mongo Running
	procon_data.StartMongo()
		
	fmt.Println("Ws Server Running on port 1200.")
	if err := http.ListenAndServeTLS(*addr, "/etc/letsencrypt/live/var.pr0con.com/cert.pem", "/etc/letsencrypt/live/var.pr0con.com/privkey.pem", mux); err != nil {
		log.Fatal(err)
	}	
}



