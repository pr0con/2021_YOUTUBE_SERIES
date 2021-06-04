package procon_data

import(
	"net"
	 "fmt"
	"time"
	"errors"
	"strings"
	"net/http"
	"io/ioutil"
	"crypto/rsa"
	"crypto/rand"
	"encoding/hex"
	"crypto/subtle"
	"encoding/json"
	"encoding/base64"
	
	"github.com/gobwas/ws/wsutil"
	
	"github.com/gin-gonic/gin"
	jwtgo "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/argon2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	
	"go_micro_services/procon_tokenc"
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

/* Websocket */
type Procon struct {
	Conn net.Conn
	Uuid string
	R *wsutil.Reader
	W *wsutil.Writer
	E *json.Encoder
	D *json.Decoder
}




/* Rest Data Structs */
//bson retains the underscores here...
type LCID struct {
	Key 		string `bson:"key"`
	AtSalt  string `bson:"at_salt"`
	RtSalt  string `bson:"rt_salt"`
	Exp		primitive.Timestamp `json:"exp"`	
}


type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

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
	Picture string `json:"picture,omitempty"`
	Password	string `json:"password"`
}


/* Websocket Data */
type Msg struct {
	Jwt string `json:"jwt"`
	LCID string `json:"lcid"`
	Owner string `json:"owner"`
	Type string `json:"type"`
	Data string `json:"data"`
}

type RespMsg struct {	
	Type string `json:"type, omitempty"`
	Success bool `json:"success"`
	Owner string `json:"owner, omitempty"`
	Data string `json:"data"`
	Error string `json:"error,omitempty"`	
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
		iterations:	 	3,
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
							   
	encodedHash = fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, p.memory, p.iterations, p.parallelism, b64Salt, b64Hash)
	
	return encodedHash, nil
}

func DecodeArgonHash(encodedHash string) (p *argonParams, salt, hash []byte, err error) {
	vals := strings.Split(encodedHash, "$")
	if len(vals) != 6 {
		return nil, nil, nil, errors.New("The encoded hash is not in the correct format.")
	}
	
	var version int
	_, err = fmt.Sscanf(vals[2], "v=%d", &version)
	if err != nil {
		return nil, nil, nil, err
	}
	
	if version != argon2.Version {
		return nil, nil, nil, errors.New("Incopatible version of argon2")
	}
	
	p = &argonParams{}
	_, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &p.memory, &p.iterations,&p.parallelism)
	if err != nil { return nil, nil, nil, err; }

	salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])
	if err != nil { return nil, nil, nil, err; }
	p.saltLength = uint32(len(salt))
	
	hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
	if err != nil { return nil, nil, nil, err; }
	p.keyLength = uint32(len(hash))

	return p, salt, hash, nil
}

func ComparePasswordAndHash(password, encodedHash string) (match bool, err error) {
	p, salt, hash, err := DecodeArgonHash(encodedHash)
	if err != nil { return false, err; }
	
	otherHash := argon2.IDKey([]byte(password), salt, p.iterations, p.memory, p.parallelism, p.keyLength)
	fmt.Println(otherHash)
	
	if subtle.ConstantTimeCompare(hash, otherHash) == 1 {
		return true, nil
	}	
	return false, nil
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

func ValidateRestJWT(token_type string, c *gin.Context) (bool, *User) {
	//Look for LCID Cookie
	lcid_record, err := c.Cookie("lcid_session_oid")
	if err != nil { 
		resp := &RespMsg{
			Success: false, 
			Data: fmt.Sprintf("No LCID Record Idicator: %s",err.Error()),
		}
		c.JSON(http.StatusUnauthorized, resp)		
		return false,nil		
	}
	
	
	//Next Get LCID Record from DB
	lcid_oid, err := primitive.ObjectIDFromHex(lcid_record)
	if err != nil {
		resp := &RespMsg{
			Success: false, 
			Data: fmt.Sprintf("LCID Conversion broke things: %s",err.Error()),
		}
		c.JSON(http.StatusUnauthorized, resp)		
		return false,nil
	}		
	lcid_obj := GetLCID(&lcid_oid)	
	
	//Extract JWT from authorization header if it exists
	hex_encoded_jwt := c.GetHeader("authorization") //for rest calls after login or refresh... like profile
	
	
	if token_type == "ACCESS_TOKEN" {
		splitToken := strings.Split(hex_encoded_jwt, "Bearer ")
		hex_encoded_jwt = splitToken[1]
	}
	
	if token_type == "REFRESH_TOKEN" {
		var err error
		hex_encoded_jwt, err = c.Cookie("refresh_token")
		
		//if err cookie not set...
		if err != nil {
			resp := &RespMsg{
				Success: false, 
				Data: fmt.Sprintf("No refresh token found: %s",err.Error()),
			}
			c.JSON(http.StatusUnauthorized, resp)		
			return false,nil	
		}		
	}
	
	//Now we have our encrypted jwt encoded as hex... we need to de-hex encode
	encrypted_jwt, err := hex.DecodeString(hex_encoded_jwt)
	if err != nil {
		resp := &RespMsg{
			Success: false, 
			Data: fmt.Sprintf("Unable to de hex jwt: %s",err.Error()),
		}
		c.JSON(http.StatusUnauthorized, resp)		
		return false,nil
	}		
	
	//key same for both
	//get correct salt to use
    hex_encoded_salt := lcid_obj.AtSalt; if token_type == "REFRESH_TOKEN" { hex_encoded_salt = lcid_obj.RtSalt; }
	//Dehex encode the salt
	hex_decoded_salt, err := hex.DecodeString(hex_encoded_salt)
	if err != nil {
		resp := &RespMsg{
			Success: false, 
			Data: fmt.Sprintf("Unable to decode hex salt: %s",err.Error()),
		}
		c.JSON(http.StatusUnauthorized, resp)		
		return false,nil	
	}		
	
	
	//Next Decrypt the Token
	jwt, err := procon_tokenc.Decrypt2([]byte(lcid_obj.Key), []byte(hex_decoded_salt), []byte(encrypted_jwt))
	if err != nil {
		resp := &RespMsg{
			Success: false, 
			Data: fmt.Sprintf("Could not decrypt token: %s",err.Error()),
		}
		c.JSON(http.StatusUnauthorized, resp)		
		return false,nil
	}			
	//end section	
	
	
	token, err := jwtgo.Parse(string(jwt), func(token *jwtgo.Token) (interface{}, error) {
		return PubKeyFile,nil 	
	})
	
	if err != nil {
		resp := &RespMsg{
			Success: false,
			Data:  fmt.Sprintf("Unauthorized Request:  %s", err.Error()),
		}
		c.JSON(http.StatusUnauthorized, resp)
		return false,nil
				
	} else if (token.Valid && err == nil) {
		claims := token.Claims.(jwtgo.MapClaims)
		
		user := claims["user"].(map[string]interface{}) //_id alias email
		meta := claims["meta"].(map[string]interface{}) //Token Type && LCID custom crap i do later
	
		claims_meta_token_type := meta["type"].(string)
		claims_user_id := user["_id"].(string)
		
		fmt.Println(claims_user_id)
		fmt.Println(claims_meta_token_type)
		
					
		u, err := GetUser([]byte(claims_user_id)) //@mongo.go
		if err != nil {
			resp := &RespMsg{
				Success: false,
				Data:  fmt.Sprintf("Error finding account / profile:  %s", err.Error()),
			}
			c.JSON(http.StatusUnauthorized, resp)
			return false,nil		
		}
		
		//If access token request at this point we are okay to return true... access granted for request
		if token_type == "ACCESS_TOKEN" && claims_meta_token_type == "ACCESS_TOKEN" {
			return true, u
		}
		
		if token_type == "REFRESH_TOKEN" && claims_meta_token_type == "REFRESH_TOKEN" {
			//Only generate a new access token since since we want the refresh token to live 24hrs			
			at, err := GenerateJWT("ACCESS_TOKEN", u)
			if err != nil {
				resp := &RespMsg{
					Success: false,
					Data:  fmt.Sprintf("Problem refreshing access token:  %s", err.Error()),
				}
				c.JSON(http.StatusInternalServerError, resp)
				return false,nil	
			}
			
			//We now need to encrypt a new AT after a refresh using same LCID
			encrypted_at,at_salt,err := procon_tokenc.Encrypt2([]byte(lcid_obj.Key), []byte(at))
			if err != nil { 
				resp := &RespMsg{
					Success: false, 
					Data: fmt.Sprintf( "Problem Encrypting refreshed access_token: %s",err),
				}		
				c.JSON(http.StatusInternalServerError, resp)
				return false,nil		
			}
			encrypted_at_hex := hex.EncodeToString(encrypted_at)
			at_salt_hex := hex.EncodeToString(at_salt)				
			
			//Update LCID Record Access Token Salt 
			if err := MongoUpdateAtSalt(&lcid_oid, at_salt_hex); err != nil {
				resp := &RespMsg{
					Success: false, 
					Data: fmt.Sprintf("Problem Updating access_token LCID Salt: %s",err),
				}		
				c.JSON(http.StatusInternalServerError, resp)
				return	false,nil
			}			
			
			
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"data": "Your Session has been refreshed.",
				"type": "access-token",
				"lcid": lcid_oid,
				"access_token": encrypted_at_hex,
			})
			
			return true,nil
		}
	}
	
	return false,nil
}



func ValidateWssJWT(lcid, at string) (bool, *User, error) {
	lcid_oid, err := primitive.ObjectIDFromHex(lcid)
	if err != nil { return false,nil,err }
	
	lcid_obj := GetLCID(&lcid_oid)
	
	//hex decode jwt
	encrypted_jwt, err := hex.DecodeString(at)
	if err != nil { return false, nil, err }
	
	//always should be access token.. 
	hex_decoded_salt, err := hex.DecodeString(lcid_obj.AtSalt)
	if err != nil { return false, nil, err }
	
	jwt, err := procon_tokenc.Decrypt2([]byte(lcid_obj.Key), []byte(hex_decoded_salt), []byte(encrypted_jwt))
	if err != nil { return false, nil, err }
		
	token, err := jwtgo.Parse(string(jwt), func(token *jwtgo.Token) (interface{}, error) {
		return PubKeyFile, nil
	});	
	if err != nil || token.Valid != true { return false, nil, err } 		
	
	claims := token.Claims.(jwtgo.MapClaims)
	user	:= claims["user"].(map[string]interface{}) // _id alias email
	meta	:= claims["meta"].(map[string]interface{}) // lcid todo		
	
	claims_meta_token_type := meta["type"].(string)
	claims_user_id := user["_id"].(string)
	
	fmt.Println(claims_meta_token_type)
	fmt.Println(claims_user_id)	
	
	u, err := GetUser([]byte(claims_user_id))
	if err != nil { return false, nil, err }
	
	return token.Valid, u, nil			
}

func SendMsg(t string, s bool, o string, d string, e error, p *Procon) {
	m := &RespMsg{t, s, o, d, ""}//type success owner data
	if e != nil { m.Error = e.Error() }
	
	if err := p.E.Encode(&m); err != nil {
		fmt.Println( err )
	}
	
	if err := p.W.Flush(); err != nil {
		fmt.Println( err )	
	}
}



