package procon_gin

import(
	"os"
	"fmt"
	"net/http"
	"encoding/hex"
	"path/filepath"
	
	
	"github.com/google/uuid"
	"github.com/gin-gonic/gin"
	
	"go_micro_services/procon_data"
	"go_micro_services/procon_tokenc"
)



func AuthRefresh(c *gin.Context) {
	_,_ = procon_data.ValidateRestJWT("REFRESH_TOKEN", c)	
}


func AuthLogout(c *gin.Context) {
	c.SetCookie(
		"refresh_token",
		"",
		-1, //this will kill the 24hrs token
		"/",
		"var.pr0con.com",
		true,
		true,
	)
	
	c.SetCookie(
		"lcid_session_oid",
		"",
		-1, //this will kill the 24hrs token
		"/",
		"var.pr0con.com",
		true,
		true,
	)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": "Your session has been wiped",
	})
}

func AuthLogin(c *gin.Context) {
	var login procon_data.Login
	
	if err := c.ShouldBind(&login); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
			"success": false,
			"data": "Corrupt data provided...",
		})	
		return	
	}
	
	authenticated, err := procon_data.AuthenticateUser(login.Username, login.Password)
	if err != nil {
		resp := &procon_data.RespMsg{
			Error: err.Error(),
			Success: false,
			Data: "Problem generating authorization tokens.",
		}
		c.AbortWithStatusJSON(http.StatusBadRequest, resp)
		return			
	}
	
	if authenticated ==  nil {
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Invalid Login",
		}
		c.JSON(http.StatusUnauthorized, resp)
		return
	}
	
	at, err := procon_data.GenerateJWT("ACCESS_TOKEN", authenticated)
	if err != nil { 
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem generating access token.",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return		
	} 
	
	rt, err := procon_data.GenerateJWT("REFRESH_TOKEN", authenticated)
	if err != nil { 
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem generating refresh token.",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return		
	} 	
	
	
	/* Enrypt the tokens */
	key, err := uuid.NewRandom()
	if err != nil {
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem Generating Uuid Key.",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return		
	}
	
	key_str := key.String()
	//fmt.Println(key_str)
	
	encrypted_at, at_salt, err := procon_tokenc.Encrypt2([]byte(key_str), []byte(at))
	if err != nil {
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem Encrypting Access Token",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return				
	}
	//Convert encrypted token to hex
	encrypted_at_hex := hex.EncodeToString(encrypted_at)
	at_salt_hex := hex.EncodeToString(at_salt)
	
	
	encrypted_rt, rt_salt,err := procon_tokenc.Encrypt2([]byte(key_str), []byte(rt))
	if err != nil {
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem Encrypting Refresh Token",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return				
	}
	//Convert encrypted refresh token to hex
	encrypted_rt_hex :=  hex.EncodeToString(encrypted_rt)
	rt_salt_hex := hex.EncodeToString(rt_salt)
	
	
	//Store LCID (Life Cycle ID -- a custom thing of mine) 
	stored_lcid_result, lcid_session_oid := procon_data.StoreLCID(key_str, at_salt_hex, rt_salt_hex)
	if stored_lcid_result == false {	
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem Encrypting Refresh Token",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return
	}
	
	
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie(
		"lcid_session_oid",
		lcid_session_oid,
		3600*24,
		"/",
		"var.pr0con.com",
		true,
		true,
	)		
		
	c.SetCookie(
		"refresh_token",
		encrypted_rt_hex,
		3600*24,
		"/",
		"var.pr0con.com",
		true,
		true,
	)	
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": "You are logged in",
		"type": "access-token",
		"lcid": lcid_session_oid,
		"access_token": encrypted_at_hex,
	})
}



func AuthRegister(c *gin.Context) {
	file, err := c.FormFile("file")
	
	//remove file from frontend to test
	//Must upload picture with profile....
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": "No file received.",
		})
	}
	
	extension := filepath.Ext(file.Filename)
	newFileName := uuid.New().String() + extension
	
	
	//remove folder to test error...
	if err := c.SaveUploadedFile(file, procon_data.PROFILE_UPLOAD_PATH + newFileName); err != nil {
		_ = os.Remove(procon_data.PROFILE_UPLOAD_PATH + newFileName)
		
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
			"success": false,
			"data": "unable to save the file",
		})
		return
	}
	
	var newRegistration procon_data.RegistrationForm
	if err := c.ShouldBind(&newRegistration); err != nil {
		_ = os.Remove(procon_data.PROFILE_UPLOAD_PATH + newFileName)
		
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
			"success": false,
			"data": "All Fields required",
		})
		return		
	}
	newRegistration.Picture = newFileName
	
	//package:procon_data/mongo.go
	nu_result, at, rt, err := procon_data.RegisterUser(&newRegistration)
	if nu_result == false || err != nil {
			_ = os.Remove(procon_data.PROFILE_UPLOAD_PATH + newFileName)
		
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
			"success": false,
			"data": "Unable to create account / user credentials",			
		});
		return
	}
	
	
	/* Encrypt new tokens */
	key, err := uuid.NewRandom()
	if err != nil {
		resp := &procon_data.RespMsg{
			Success: false,
			Data: "Problem Generating Uuid Key.",
		}
		c.JSON(http.StatusInternalServerError, resp)
		return		
	}
	
	key_str := key.String()
	//fmt.Println(key_str)	
	
	encrypted_at, at_salt, err := procon_tokenc.Encrypt2([]byte(key_str), []byte(at))
	if err != nil { 
		resp := &procon_data.RespMsg{
			Success: false, 
			Data: "Problem Encrypting access_token",
		}		
		c.JSON(http.StatusInternalServerError, resp)
		return		
	}
	encrypted_at_hex := hex.EncodeToString(encrypted_at)
	at_salt_hex := hex.EncodeToString(at_salt)
		
		
	encrypted_rt,rt_salt,err := procon_tokenc.Encrypt2([]byte(key_str), []byte(rt))
	if err != nil { 
		resp := &procon_data.RespMsg{
			Success: false, 
			Data: "Problem Encrypting refresh_token",
		}		
		c.JSON(http.StatusInternalServerError, resp)
		return
	}
	encrypted_rt_hex := hex.EncodeToString(encrypted_rt)
	rt_salt_hex := hex.EncodeToString(rt_salt)
	
	
	stored_lcid_result, lcid_session_oid := procon_data.StoreLCID(key_str, at_salt_hex, rt_salt_hex)
	if stored_lcid_result == false {
		resp := &procon_data.RespMsg{
			Success: false, 
			Data: "Problem Encrpyting Storing Encryption Records",
		}		
		c.JSON(http.StatusInternalServerError, resp)
		return		
	}	
		
	
	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie(
		"lcid_session_oid",
		lcid_session_oid,
		3600*24,
		"/",
		"var.pr0con.com",
		true,
		true,
	)		
		
	c.SetCookie(
		"refresh_token",
		encrypted_rt_hex,
		3600*24,
		"/",
		"var.pr0con.com",
		true,
		true,
	)	
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": "You are logged in",
		"type": "access-token",
		"lcid": lcid_session_oid,
		"access_token": encrypted_at_hex,
	})
}

func AuthProfile(c *gin.Context) {
	valid, u := procon_data.ValidateRestJWT("ACCESS_TOKEN", c)
	if valid == false || u == nil {
		fmt.Println("Profile Access Request Denied.")
		return
	}
	
	u.Password = "F00"
	c.JSON(http.StatusOK, u)
	return
}
