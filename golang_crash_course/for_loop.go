package main

import(
	"fmt"
)

func main() {
	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}
	
	i := 1
	for i <= 100 {
		fmt.Println(i)
		i++	
	}
	
	var words = "I love coding"
	for i,c := range words {
		//fmt.Println("Index: ",i, "Character: ", c)
		fmt.Println("Index: ",i, "Character: ", string(c))	
	}
}