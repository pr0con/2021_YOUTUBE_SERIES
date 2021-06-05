package main

import(
	"os"
	"fmt"	
	"errors"
)

func returnError() error {
	//something went wrong in function
	
	return errors.New("Something went horribly wrong!")	
}

func openNonExistantFile() error {
	f, err := os.Open("non-existant-file.php")
	if err != nil { return err }	
	
	defer f.Close()
	return nil
}

func main() {
	fmt.Println(returnError())
	
	err := openNonExistantFile()
	if err != nil {
		//fmt.Println(fmt.Errorf("%v", err))
		fmt.Println(err.Error())
	}
}
