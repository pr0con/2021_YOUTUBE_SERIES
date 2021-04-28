package procon_gin

func MapAuthRoutes() {
	Router.GET("/api/auth/logout", AuthLogout)
	Router.GET("/api/auth/refresh", AuthRefresh)
	Router.GET("/api/auth/profile", AuthProfile)
	
	Router.POST("/api/auth/login", AuthLogin)
	Router.POST("/api/auth/register", AuthRegister)
}