package procon_gin

func MapAuthRoutes() {
	Router.POST("/api/auth/login", AuthLogin)
	Router.GET("/api/auth/logout", AuthLogout)
	Router.GET("/api/auth/refresh", AuthRefresh)
	Router.POST("/api/auth/register", AuthRegister)
}