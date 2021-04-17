package procon_data

import(
	"fmt"
	"time"
	//"sync"
	//"errors"
	"context"
	//"net/http"
	//"encoding/json"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	//"go.mongodb.org/mongo-driver/bson/primitive"
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

func StopMongo() {
	client.Disconnect(ctx)
}