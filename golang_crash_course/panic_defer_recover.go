package main

import(
	"fmt"
)

//Utility Function: Recover from panic
func R() {
	if r := recover(); r != nil {
		fmt.Println(r, " Shake the dust off and continue...")
	}	
}

//defer order of ops
func doStuff() {
	defer fmt.Println("One")
	defer fmt.Println("Two")	
	
	fmt.Println("Three")
}

func doPanic() {
	defer R()
	
	panic("ALL HELL IS BREAKING LOOSE!")	
}

func main() {
	doStuff()
	doPanic()
}