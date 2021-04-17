package procon_gin

func MapAuthRoutes() {
	Router.GET("/api/auth/register", AuthRegister)
}