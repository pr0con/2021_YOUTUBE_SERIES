package main

import(
	"fmt"
)

func main() {
	something := "a-string"
	
	switch something {
		case "not-it":
			fmt.Println("wont hit me cuz there not equal.")
		case "a-string":
			fmt.Println("HIT!!!")
		default:
			fmt.Println("A switch statement ran but no case found.")	
	}
	
	i := 20
	
	//kinda unique to go where we can just open and switch off logic statements
	switch {
		case i != 10:
			fmt.Println("will because the statement is true. my bad."); fallthrough
		case i < 100:
			fmt.Println("True: i is less than 100")
		case i > 20:
			fmt.Println("True but we wont get here because no fallthrough on last statement")
		default:
			fmt.Println("If nothing else")
	}
}