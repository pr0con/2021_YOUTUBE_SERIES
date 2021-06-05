package main

import(
	"fmt"	
)

func main() {
	var someFloats [3]float64
	
	fmt.Println(someFloats)	
	
	var someFloats2 [3]float64 = [3]float64{1.1,2.2,3}
	
	fmt.Println(someFloats2)
	
	var aSlice []int
	aSlice = make([]int,5,10)
	
	fmt.Println(aSlice)
	
	fmt.Println(len(aSlice))
	fmt.Println(cap(aSlice))
	
	someNames := [5]string{"A","B","C","D","E"}
	spicedNames := someNames[2:3]
	
	fmt.Println(spicedNames)
	
	spicedNames = append(spicedNames, "x","y","z")
	fmt.Println(spicedNames)
}

