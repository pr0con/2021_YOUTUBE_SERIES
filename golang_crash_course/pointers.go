package main

import(
	"fmt"
)

func changeValue(s *string) {
	*s = "I have been updated"	
}

func main() {
	var something string
	var somePointer *string
	
	something = "A string of somthing."
	somePointer = &something
	
	getValue := *somePointer
	fmt.Println(getValue)
	
	changeValue(&getValue)
	fmt.Println(getValue)
}