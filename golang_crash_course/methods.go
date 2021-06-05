package main

import(
	"fmt"
)

type User struct {
	Id 			string
	FullName 	string
	Alias 		string
	Email 		string
	Password 	string
	Active 		bool	
}

func isUserActive(u *User) bool {
	if u.Active { return true } else { return false }	
}

//A receiver function or method
func (u *User) isUserActive() bool {
	if u.Active { return true } else { return false }	
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
	
	fmt.Println(u)	
	
	fmt.Println("IsActive: ", isUserActive(&u))
	u.Active = true
	fmt.Println("IsActive: ", u.isUserActive())
}



