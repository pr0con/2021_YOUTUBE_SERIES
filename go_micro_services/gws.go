package main

import(
	"log"
	"fmt"
	"flag"
	"net/http"
	"encoding/json"
	
	"github.com/google/uuid"
	
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"	
	
	"go_micro_services/procon_data"
)

var addr = flag.String("addr", "0.0.0.0:1200", "Ws Service Address")

func handleAPI(w http.ResponseWriter, r *http.Request) {
	
	//disconnect anyone who is from our site...
	if r.Header.Get("Origin") != "https://var.pr0con.com" {
		http.Error(w, "Cross site connection not permitted.", http.StatusUnauthorized)
		return
	}
	
	//let see what is in the headers...
	for name, values := range r.Header {
		for _, value := range values {
			fmt.Println(name, value)
		}
	}
	
	id, err := uuid.NewRandom()
	if err != nil { fmt.Println(err); return }
	
	conn, _, _, err := ws.UpgradeHTTP(r, w)
	if err != nil { return }
	
	procon_ := &procon_data.Procon{
		Conn: conn,
		Uuid: "wsid-"+id.String(),
	}
	
	go func() {
		defer conn.Close()
		
		r := wsutil.NewReader(conn, ws.StateServerSide)
		w := wsutil.NewWriter(conn, ws.StateServerSide, ws.OpText)
		decoder := json.NewDecoder(r)
		encoder := json.NewEncoder(w)		
		

		//Friendly Hello ...
		resp := procon_data.RespMsg{Type: "wsid", Success: true, Data: procon_.Uuid }
		
		if err := encoder.Encode(&resp); err != nil {
			fmt.Println( err )
		}
		
		if err = w.Flush(); err != nil {
			fmt.Println( err )
		}		
				
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



