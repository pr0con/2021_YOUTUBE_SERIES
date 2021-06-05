//https://golang.org/pkg/go/types/#pkg-examples

package main

import(
	"fmt"
	"reflect"
)

//See Interfaces with reflection
func main() {
	var i = 42
	c := make(chan int)
	
	fmt.Println(reflect.TypeOf(i))
	fmt.Println(reflect.TypeOf("A String"))
	
	fmt.Println(reflect.TypeOf(float64(i) * 4.2))
	
	fmt.Println(reflect.TypeOf(c))
}