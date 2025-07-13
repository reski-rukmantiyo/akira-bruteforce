package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db, err := initDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Set Gin mode
	gin.SetMode(gin.ReleaseMode)

	// Create router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "https://your-frontend-domain.vercel.app"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// API routes
	api := r.Group("/api")
	{
		// GPU Types
		api.GET("/gpu-types", getGPUTypes(db))
		api.POST("/gpu-types", createGPUType(db))
		api.PUT("/gpu-types/:id", updateGPUType(db))
		api.DELETE("/gpu-types/:id", deleteGPUType(db))

		// Providers
		api.GET("/providers", getProviders(db))
		api.POST("/providers", createProvider(db))
		api.PUT("/providers/:id", updateProvider(db))
		api.DELETE("/providers/:id", deleteProvider(db))

		// GPU Prices
		api.GET("/gpu-prices", getGPUPrices(db))
		api.POST("/gpu-prices", createGPUPrice(db))
		api.PUT("/gpu-prices/:id", updateGPUPrice(db))
		api.DELETE("/gpu-prices/:id", deleteGPUPrice(db))
	}

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}