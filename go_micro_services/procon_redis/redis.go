package procon_redis


import(
	"io"
	//"os"
	"fmt"
	//"time"
	"bytes"
	"bufio"
	"strings"
	"os/exec"
	"encoding/json"
	
	"github.com/gomodule/redigo/redis"
	
	"go_micro_services/procon_rdt"
)

func newPool() *redis.Pool {
	return &redis.Pool{
		MaxIdle: 80,
		MaxActive: 12000, // max number of connections
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", ":6379", redis.DialPassword("1LXd7/uajho93zgHpwrQGilAruZiDlw5t7p8bMlEqShH/6fy09PcasHhQKcm5qe0HTeK7AuUENYgI7Yx"))
			if err != nil { panic(err.Error()) }
			
			return c, err	
		},
	}
}
var Pool = newPool()


func CheckRedisVFSKeyExists(key string) bool {
	c := Pool.Get()
	defer c.Close()
	
	res, err := c.Do("GET", key)
	if err != nil || res == nil { fmt.Println(err); return false }
	
	return true 	
}

func WipeAndGenerateVFSKeys() {
	c := Pool.Get()
	defer c.Close()
	
	
	rd, err := 	procon_rdt.GetRecursiveDirectoryTree("/var/www/VFS")
	if err != nil { fmt.Println(err); return }
	
	var mrd []byte
	mrd, _ = json.Marshal(rd)
	
	c1 := exec.Command("echo", string(mrd))
	c2 := exec.Command("jq", "..| .path? //empty")
	
	r, w := io.Pipe()
	c1.Stdout = w
	c2.Stdin = r
	
	var b2 bytes.Buffer
	c2.Stdout = &b2
	
	c1.Start()
	c2.Start()
	c1.Wait()
	w.Close()
	c2.Wait()
	
	//io.Copy(os.Stdout, &b2)
	
	scanner := bufio.NewScanner(&b2)
	
	scanner.Split(bufio.ScanLines)
	var text []string
	
	for scanner.Scan() {
		text = append(text, scanner.Text())	
	}

	//clear keys first
	res, err := c.Do("FLUSHALL")
	if err != nil || res == nil { fmt.Println(err); return }
	
	
	for _, each_ln := range text {
		current_line := fmt.Sprintf(strings.Replace(each_ln, "\"", "", -1))
		res, err := c.Do("SET", current_line, 1)
		if err != nil || res == nil { fmt.Println(err); return } 
	}
		
	//fmt.Println(text)	
}







