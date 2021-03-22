package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/thinkerou/favicon"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(favicon.New("./public/images/favicon.ico"))
	r.Use(static.Serve("/", static.LocalFile("./public", true)))
	r.Run(":3000")
}
