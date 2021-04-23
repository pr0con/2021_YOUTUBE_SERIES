package procon_data

import(
	"fmt"
	"time"
	"io/ioutil"
	"crypto/rsa"
	"crypto/rand"
	"encoding/base64"
	
	jwtgo "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/argon2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var(
	PubKeyFile  *rsa.PublicKey
	PrivKeyFile *rsa.PrivateKey
)

func init() {
	f, err := ioutil.ReadFile(PUBLIC_KEY_PATH); if err != nil {
		fmt.Println(err);
	}else { PubKeyFile, err = jwtgo.ParseRSAPublicKeyFromPEM(f); if err != nil { fmt.Println(err); }}
	
	f, err = ioutil.ReadFile(PRIVATE_KEY_PATH); if err != nil {
		fmt.Println(err);
	}else { PrivKeyFile, err = jwtgo.ParseRSAPrivateKeyFromPEMWithPassword(f, PKPWD); if err != nil { fmt.Println(err); }}	
}


/* Rest Data Structs */
type RegistrationForm struct {
	Alias string `form:"alias" binding:"required"`
	Email string `form:"email" binding:"required"`
	Picture string `json:"picture"`
	Password string `form:"password" binding:"required"`
}

type User struct {
	Id			*primitive.ObjectID `json:"ID" bson:"_id,omitempty"`
	Alias		string `json:"alias"`
	Email		string `json:"email"`
	Password	string `json:"password"`
}


/* Websocket Data */
type Msg struct{
	Jwt string `json:"jwt"`
	Type string `json:"type"`
	Data string `json:"data"`
}

type RespMsg struct {	
	Type string `json:"type"`
	Success string `json:"success"`
	Data string `json:"data"`	
}

/* Argon 2 data objects */
type argonParams struct {
	memory uint32
	iterations uint32
	parallelism uint8
	saltLength uint32
	keyLength uint32
}


func GenerateArgonHash(password string) (encodedHash string, err error) {
	p := &argonParams {
		memory: 		64 * 1024,
		iterations: 	3,
		parallelism: 	2,
		saltLength:     16,
		keyLength:		32,
	}	
	
	salt := make([]byte, p.saltLength)
	_, err = rand.Read(salt)	
	if err != nil { return "", err; }
	
	hash := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)
	
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)
	
	encodedHash = fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s%s", argon2.Version, p.memory, p.iterations, p.parallelism, b64Salt, b64Hash)
	
	return encodedHash, nil
}


func  GenerateJWT(jwt_type string, user *User) (string,error) {
	token := jwtgo.New(jwtgo.SigningMethodRS256)
	exp := time.Now().Add(time.Duration(30) * time.Minute).Unix() //30 Minutes
	
	if jwt_type == "REFRESH_TOKEN" {
		exp = time.Now().Add(time.Duration(24) * time.Hour).Unix() // 24 Hours
	}
	
	//Create actual token claims
	token.Claims = jwtgo.MapClaims{
		"iss":    "var.pr0con.com", 	// who creates the token and signs it
		"aud":    "var.pr0con.com", 	// to whom the token is intended to be sent
		"exp":    exp,               	// time when the token will expire (10 minutes from now)
		"jti":    "Unique",          	// a unique identifier for the token
		"iat":    time.Now().Unix(), 	// when the token was issued/created (now)
		"nbf":    2,                 			  // time before which the token is not yet valid (2 minutes ago)
		"sub":    "Development Services",         // the subject/principal is whom the token is about
		"meta": map[string]string{
			"type": jwt_type,
			"lcid": "todo",
		},
		"user": map[string]interface{} {
			"_id": user.Id,
			"alias": user.Alias,
			"email": user.Email,
		},			
	}
	
	tokenString, err := token.SignedString(PrivKeyFile)
	if err != nil { return "", err }else { return tokenString, nil }
	
	//?
}

