package main

import(
	"fmt"
)

//we can return multiple variables and define multiple variable all at once... a nice go feature
var a,b,c = "a","b","c"

func returnMultiple() (int,string) {
	return 1,"hello"
}

func main() {
	fmt.Println(a,b,c)
	
	i, s := returnMultiple()
	fmt.Println(i,s)
}