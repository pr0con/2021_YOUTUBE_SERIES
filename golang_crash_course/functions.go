package main

import(
	"fmt"
)

func aFunc(num int) (int,int) {
	fmt.Println("Number in:", num)
	fmt.Printf("Number in: %d \n", num)
	return 1,2	
}

func bFunc() (a int, b int) {
	a = 100
	b = 200
	return a,b	
}

func someSpread(nums ...int) bool {
	for _, v := range nums {
		fmt.Println(v)
	}	
	
	return true
}

func main() {
	aFunc(42)
	
	a,b	:= bFunc()
	fmt.Println(a,b)
	
	someSpread(1,2,3)
}