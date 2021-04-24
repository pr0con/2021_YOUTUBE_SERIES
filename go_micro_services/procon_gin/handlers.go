package procon_gin

import(
	"os"
	//"fmt"
	"net/http"
	"path/filepath"
	
	"github.com/google/uuid"
	"github.com/gin-gonic/gin"
	
	"go_micro_services/procon_data"
)

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
	
	c.SetCookie(
		"refresh_token",
		rt,
		3600*24,
		"/",
		".pr0con.com",
		true,
		true,
	)	
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": "You are logged in",
		"type": "access-token",
		"access_token": at,
	})
}

func AuthLogout(c *gin.Context) {
	
}

func AuthRefresh(c *gin.Context) {

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
	
	c.SetCookie(
		"refresh_token",
		rt,
		3600*24,
		"/",
		".pr0con.com",
		true,
		true,
	)
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": "Your profile has bein created.",
		"type": "access-token",
		"access_token": at,
	});
}







