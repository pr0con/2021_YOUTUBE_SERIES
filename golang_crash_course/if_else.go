package main

import(
	"fmt"
	"errors"
)

func makeError() error {
	return errors.New("I am an error from function")	
}

func main() {
	var a bool = true
	var b bool = false
	
	if a { fmt.Println("A is true") }
	
	if b { /* Nothing will happen: not true */ } else {
		fmt.Println("B def not true")
	}
	
	var c int = 0
	
	if c > 100 {
		fmt.Println("wont happend: c not greater than")
	} else if c > 100 {
		fmt.Println("wont happen: c less than 100")	
	} else {
		fmt.Println("if all else fails... I happen")	
	}
	
	err := makeError()
	if err != nil { fmt.Println(err.Error()) }
	
	if err := makeError(); err != nil {
		fmt.Println(err.Error()) 
	}
}