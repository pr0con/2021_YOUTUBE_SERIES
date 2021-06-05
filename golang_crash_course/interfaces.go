package main

import(
	"fmt"
	"reflect"
)

type User struct {
	Id 			string
	FullName 	string
	Alias 		string
	Email 		string
	Password 	string
	Active 		bool	
}

type Reflect interface {
	showReflection()
}

func (u *User) showReflection() {
	v := reflect.ValueOf(u).Elem()
	typeOfS := v.Type()
	
	for i := 0; i < reflect.Indirect(v).NumField(); i++ {
		fmt.Printf("Field: %s \t Value: %v\n", typeOfS.Field(i).Name, v.Field(i).Interface())
	}
}

func executeShowReflection(r Reflect) {
	r.showReflection()
}

func main() {
	u := User{
		Id: "AABBCC",
		FullName: 	"Tom Huck",
		Alias: 		"Xbin",
		Email: 		"someone@somewhere.com",
		Password: 	"lkadjfajd;fj",
		Active: false,
	}
	
	executeShowReflection(&u)
}