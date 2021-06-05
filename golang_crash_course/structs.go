package main

import(
	"fmt"
)


type SomeStruct struct {
	ObjId int
	PropertyA, PropertyB, PropertyC string
}

type Things struct {
	Type string
	Active bool
	Stuff []SomeStruct 
}

func setThingsActive(t Things) { //carbon bopy basically
	t.Active = false
	fmt.Println(t)	
}

func main() {
	ss := SomeStruct{ObjId: 1, PropertyA: "prop a", PropertyB: "prop b", PropertyC: "C"}
	fmt.Println(ss)
	fmt.Println(ss.PropertyA)
	
	sss := fmt.Sprintf("Id: %d PropA: %s PropB: %s PropC: %s", ss.ObjId, ss.PropertyA, ss.PropertyB, ss.PropertyC)
	fmt.Println(sss)
	
	ss2 := SomeStruct{ObjId: 1, PropertyA: "prop a", PropertyB: "prop b", PropertyC: "C"}
	ss3 := SomeStruct{ObjId: 1, PropertyA: "prop a", PropertyB: "prop b", PropertyC: "C"}

	things := Things{
		Type: "some things",
		Active: true,
		Stuff: []SomeStruct{ss, ss2, ss3},
	}	
	//fmt.Println(things)
	
	setThingsActive(things)
	fmt.Println(things)
}