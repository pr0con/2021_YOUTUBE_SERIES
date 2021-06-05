package main

import(
	"fmt"
)

func main() {
	//asscociate array
	var aMap map[int]string = make(map[int]string)
	
	aMap[4] = "A String One"
	aMap[5] = "A String Two"
	
	fmt.Println(aMap)
	
	//second init method
	aMap2 := map[int]string{
		1: "String One",
		2: "String Two",
		3: "String Three",
	}
	fmt.Println(aMap2[1])
	
	doesFourExist, ok := aMap2[4]; if ok {
		fmt.Println("found Four: ", doesFourExist)
	}else {
		fmt.Println("Four not found")	
	}
	
	if _, ok = aMap2[2]; ok {
		fmt.Println("it exists")
	}else {
		fmt.Println("wont see this")	
	}
	
	//to delete a key from a map
	delete(aMap2, 2)
	fmt.Println(aMap2)
	
	if _, ok = aMap2[2]; ok {
		fmt.Println("it exists")
	}else {
		fmt.Println("Now we see this")	
	}	
}


