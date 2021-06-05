package main

import(
	"fmt"
)


type someStruct struct {
	A, B, C string	
}

var x = someStruct{ A: "A", B: "B", C: "C" }

func main() {
	z := &x
	z.A = "Changed"
	
	//weird loop hole with go
	y := x //we can omit & it is assumed.
	y.B = "Changed"
	
	fmt.	Println(z)
	fmt.Println(y)
}