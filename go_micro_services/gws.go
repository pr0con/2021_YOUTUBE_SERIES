package main

import(
	"log"
	"fmt"
	"flag"
	"time"
	"net/http"
	"encoding/json"
	
	"github.com/google/uuid"
	
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"	

	"go_micro_services/procon_data"
	"go_micro_services/procon_wsfs"
	"go_micro_services/procon_workerpool"
)

var WP = procon_workerpool.NewWorkerPool(5)

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
		defer procon_.Conn.Close()
		
		/*
			r := wsutil.NewReader(conn, ws.StateServerSide)
			w := wsutil.NewWriter(conn, ws.StateServerSide, ws.OpText)
			decoder := json.NewDecoder(r)
			encoder := json.NewEncoder(w)	
			
			if err := encoder.Encode(&resp); err != nil {
				fmt.Println( err )
			}
			
			if err = w.Flush(); err != nil {
				fmt.Println( err )
			}		
		*/
		procon_.R = wsutil.NewReader(procon_.Conn, ws.StateServerSide)
		procon_.W = wsutil.NewWriter(procon_.Conn, ws.StateServerSide, ws.OpText)		
		procon_.E = json.NewEncoder(procon_.W)
		procon_.D = json.NewDecoder(procon_.R)

		//Friendly Hello ...
		procon_data.SendMsg("wsid",true, "", procon_.Uuid, nil, procon_)
		
	
		LOOP:
			for {
				hdr, err := procon_.R.NextFrame()
				if err != nil {
					fmt.Println( err )
					break LOOP
				}	

				if hdr.OpCode == ws.OpClose {
					break LOOP
				}
				
				in := procon_data.Msg{}
				if err := procon_.D.Decode(&in); err != nil {
					fmt.Println(err)
					break LOOP
				}
				
				if valid,u,err := procon_data.ValidateWssJWT(in.LCID, in.Jwt); (err != nil || valid == false || u == nil) {
					fmt.Printf("Error validating lcid & jwt: %s", err.Error())	
				}else if valid == true && u != nil { //yes valid access token and we have a user 
					switch(in.Type) {
						case "get-working-directory":
							WP.AddTasks([]*procon_workerpool.Task{
								procon_workerpool.NewTask("get-working-directory", func() (interface{}, error) {
									wd, err := procon_wsfs.GetDirectory("/var/www/VFS");
									if err != nil {  procon_data.SendMsg("fs-directory",false, "", "", err, procon_);  } else {
										mwd, _ := json.Marshal(wd)
										procon_data.SendMsg("fs-directory",true, in.Owner, string(mwd), nil, procon_)
									}
									
									return true, nil
								}),	
							})
							break
							
						case "get-child-directory":
							WP.AddTasks([]*procon_workerpool.Task{
								procon_workerpool.NewTask("get-child-directory", func() (interface{}, error) {
									wd, err := procon_wsfs.GetDirectory(in.Data);
									if err != nil {  procon_data.SendMsg("fs-directory",false, "", "", err, procon_);  } else {
										mwd, _ := json.Marshal(wd)
										procon_data.SendMsg("fs-directory",true, in.Owner, string(mwd), nil, procon_)
									}
									
									return true, nil										
								}),
							})
							break
					}
				}
				
			}
	}()
}

func main() {
	go WP.Run()
	
	go func(wp procon_workerpool.WorkerPool) {
		for {
			select {
			case task := <-wp.GetProcessedTask():
				log.Printf("[main] Got task ID: %s, result: %v, err: %v \n", task.ID, task.Result, task.Err)
			default:
				time.Sleep(1 * time.Second)
				//log.Printf("[main] Waiting for result, total queued tasks %d", wp.GetTotalQueuedTask())
			}
		}
	}(WP)
		

	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handleAPI)
		
	fmt.Println("Ws Server Running on port 1200.")
	if err := http.ListenAndServeTLS(*addr, "/etc/letsencrypt/live/var-wss.pr0con.com/cert.pem", "/etc/letsencrypt/live/var-wss.pr0con.com/privkey.pem", mux); err != nil {
		log.Fatal(err)
	}	
}



