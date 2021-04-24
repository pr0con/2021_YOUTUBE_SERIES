package procon_data

import(
	"fmt"
	"time"
	//"sync"
	"errors"
	"context"
	//"net/http"
	//"encoding/json"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var tox time.Duration
var ctx context.Context
var client *mongo.Client

//init functions aways fire as preliminary before main or after an import of package
func init() {
	var err error
	client, err = mongo.NewClient(options.Client().ApplyURI("mongodb://mongod:SOMEHARDPASSWORD@127.0.0.1/admin"))
	if err != nil {
		fmt.Println("Error creating mongo client: ", err)
	}
	
	ctx = context.Background()
	tox = 2 * time.Second
	
	ctx_, cancel := context.WithTimeout(ctx, 5 * time.Second)
	defer cancel()
	
	err = client.Connect(ctx_)
	if err != nil {
		fmt.Println("Error initializing mongo client: ", err)
	}
}

func StartMongo() {
	ctx_, cancel := context.WithTimeout(ctx, tox)
	defer cancel()
	
	err := client.Ping(ctx_, readpref.Primary())
	if err != nil {
		fmt.Println("Something went horribly wrong with mongo: ", err)
	}
	
	databases, err := client.ListDatabaseNames(ctx_, bson.M{})
	if err != nil {
		fmt.Println("Problem@procon_data.mongo listing databases", err)
	}
	
	fmt.Println(databases)
}

func RegisterUser(rf *RegistrationForm) (bool,string,string,error) {
	//return true,"test_at","test_rt",nil
	ctx_, cancel := context.WithTimeout(ctx, tox)
	defer cancel()
	
	var u_data_obj User
	collection := client.Database("API").Collection("users")
	
	filter := bson.D{{
		"$or",
		bson.A{
			bson.D{{"alias", string(rf.Alias)}},
			bson.D{{"email", string(rf.Email)}},
		},
	}}
	
	//We want an error this means the user is not found.... 
	//its harmless mongo warning / err telling us no document found
	if err := collection.FindOne(ctx_, filter).Decode(&u_data_obj); err != nil {
		//no user found let continue creating
		//return true, "AT","RT", nil
		encodedHash, err := GenerateArgonHash(rf.Password) //@prcon_data/objects.go
		if err != nil { return false, "","", err}
		
		rf.Password = encodedHash
		
		collection := client.Database("API").Collection("users")
		insertResult, err := collection.InsertOne(ctx, &rf) //Fix Me...
		if err != nil { return false, "","", err}
		
		insert_doc_id := insertResult.InsertedID.(primitive.ObjectID).Hex()
		
		
		OID, err := primitive.ObjectIDFromHex(insert_doc_id)
		if err != nil { return false, "","", err}
		
		nuu := User{
			Id: &OID,
			Alias: rf.Alias,
			Email: rf.Email,
		}
		
		at, err := GenerateJWT("ACCESS_TOKEN", &nuu) //@procon_data/objects.go
		if err != nil { return false, "","", err}
		rt, err := GenerateJWT("REFRESH_TOKEN", &nuu) //@procon_data/objects.go
		if err != nil { return false, "","", err}
		
		//SUCCESS
		return true,at,rt,nil 
	}
	
	
	//fmt.Println(u_data_obj);
	return false,"","", errors.New("User or Email already taken.")
}

func AuthenticateUser(username,password string) (*User, error) {
	ctx_, cancel := context.WithTimeout(ctx, tox);
	defer cancel()
	
	var u_data_obj User
	collection := client.Database("API").Collection("users") 
	
	filter := bson.D{{
		"$or",
		bson.A{
			bson.D{{"alias", string(username)}},
			bson.D{{"email", string(username)}},
		},
	}}
	
	if err := collection.FindOne(ctx_, filter).Decode(&u_data_obj); err != nil { return nil, err}
	
	match, err := ComparePasswordAndHash(password, u_data_obj.Password)
	if err != nil { return nil, err }
	
	fmt.Println(match)
	return nil, nil
}

func StopMongo() {
	client.Disconnect(ctx)
}



