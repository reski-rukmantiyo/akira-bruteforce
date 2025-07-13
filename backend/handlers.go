package main

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GPU Types Handlers
func getGPUTypes(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT id, name, manufacturer, memory, created_at, updated_at FROM gpu_types ORDER BY name")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var gpuTypes []GPUType
		for rows.Next() {
			var gpu GPUType
			if err := rows.Scan(&gpu.ID, &gpu.Name, &gpu.Manufacturer, &gpu.Memory, &gpu.CreatedAt, &gpu.UpdatedAt); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			gpuTypes = append(gpuTypes, gpu)
		}

		c.JSON(http.StatusOK, gpuTypes)
	}
}

func createGPUType(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var gpu GPUType
		if err := c.ShouldBindJSON(&gpu); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		gpu.ID = uuid.New().String()
		gpu.CreatedAt = getCurrentTime()
		gpu.UpdatedAt = getCurrentTime()

		_, err := db.Exec("INSERT INTO gpu_types (id, name, manufacturer, memory, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
			gpu.ID, gpu.Name, gpu.Manufacturer, gpu.Memory, gpu.CreatedAt, gpu.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gpu)
	}
}

func updateGPUType(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var gpu GPUType
		if err := c.ShouldBindJSON(&gpu); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		gpu.UpdatedAt = getCurrentTime()
		_, err := db.Exec("UPDATE gpu_types SET name = ?, manufacturer = ?, memory = ?, updated_at = ? WHERE id = ?",
			gpu.Name, gpu.Manufacturer, gpu.Memory, gpu.UpdatedAt, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		gpu.ID = id
		c.JSON(http.StatusOK, gpu)
	}
}

func deleteGPUType(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		_, err := db.Exec("DELETE FROM gpu_types WHERE id = ?", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "GPU type deleted successfully"})
	}
}

// Providers Handlers
func getProviders(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query("SELECT id, name, website, country, created_at, updated_at FROM providers ORDER BY name")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var providers []Provider
		for rows.Next() {
			var provider Provider
			if err := rows.Scan(&provider.ID, &provider.Name, &provider.Website, &provider.Country, &provider.CreatedAt, &provider.UpdatedAt); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			providers = append(providers, provider)
		}

		c.JSON(http.StatusOK, providers)
	}
}

func createProvider(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var provider Provider
		if err := c.ShouldBindJSON(&provider); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		provider.ID = uuid.New().String()
		provider.CreatedAt = getCurrentTime()
		provider.UpdatedAt = getCurrentTime()

		_, err := db.Exec("INSERT INTO providers (id, name, website, country, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
			provider.ID, provider.Name, provider.Website, provider.Country, provider.CreatedAt, provider.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, provider)
	}
}

func updateProvider(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var provider Provider
		if err := c.ShouldBindJSON(&provider); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		provider.UpdatedAt = getCurrentTime()
		_, err := db.Exec("UPDATE providers SET name = ?, website = ?, country = ?, updated_at = ? WHERE id = ?",
			provider.Name, provider.Website, provider.Country, provider.UpdatedAt, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		provider.ID = id
		c.JSON(http.StatusOK, provider)
	}
}

func deleteProvider(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		_, err := db.Exec("DELETE FROM providers WHERE id = ?", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Provider deleted successfully"})
	}
}

// GPU Prices Handlers
func getGPUPrices(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := `
			SELECT 
				gp.id, gp.gpu_type_id, gp.provider_id, gp.price, gp.currency, 
				gp.date, gp.in_stock, gp.url, gp.created_at, gp.updated_at,
				gt.name as gpu_type_name, p.name as provider_name
			FROM gpu_prices gp
			JOIN gpu_types gt ON gp.gpu_type_id = gt.id
			JOIN providers p ON gp.provider_id = p.id
			ORDER BY gp.date DESC, gp.created_at DESC
		`
		
		rows, err := db.Query(query)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var prices []GPUPrice
		for rows.Next() {
			var price GPUPrice
			if err := rows.Scan(
				&price.ID, &price.GPUTypeID, &price.ProviderID, &price.Price, &price.Currency,
				&price.Date, &price.InStock, &price.URL, &price.CreatedAt, &price.UpdatedAt,
				&price.GPUTypeName, &price.ProviderName,
			); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			prices = append(prices, price)
		}

		c.JSON(http.StatusOK, prices)
	}
}

func createGPUPrice(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var price GPUPrice
		if err := c.ShouldBindJSON(&price); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		price.ID = uuid.New().String()
		price.CreatedAt = getCurrentTime()
		price.UpdatedAt = getCurrentTime()

		_, err := db.Exec(`
			INSERT INTO gpu_prices (id, gpu_type_id, provider_id, price, currency, date, in_stock, url, created_at, updated_at) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			price.ID, price.GPUTypeID, price.ProviderID, price.Price, price.Currency, 
			price.Date, price.InStock, price.URL, price.CreatedAt, price.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, price)
	}
}

func updateGPUPrice(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var price GPUPrice
		if err := c.ShouldBindJSON(&price); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		price.UpdatedAt = getCurrentTime()
		_, err := db.Exec(`
			UPDATE gpu_prices 
			SET gpu_type_id = ?, provider_id = ?, price = ?, currency = ?, date = ?, in_stock = ?, url = ?, updated_at = ? 
			WHERE id = ?`,
			price.GPUTypeID, price.ProviderID, price.Price, price.Currency, 
			price.Date, price.InStock, price.URL, price.UpdatedAt, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		price.ID = id
		c.JSON(http.StatusOK, price)
	}
}

func deleteGPUPrice(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		_, err := db.Exec("DELETE FROM gpu_prices WHERE id = ?", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "GPU price deleted successfully"})
	}
}