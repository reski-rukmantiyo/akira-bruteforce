package main

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Models
type GPUType struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Manufacturer string `json:"manufacturer"`
	Memory      string `json:"memory"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type Provider struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Website   string `json:"website"`
	Country   string `json:"country"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type GPUPrice struct {
	ID         string  `json:"id"`
	GPUTypeID  string  `json:"gpu_type_id"`
	ProviderID string  `json:"provider_id"`
	Price      float64 `json:"price"`
	Currency   string  `json:"currency"`
	Date       string  `json:"date"`
	InStock    bool    `json:"in_stock"`
	URL        string  `json:"url"`
	CreatedAt  string  `json:"created_at"`
	UpdatedAt  string  `json:"updated_at"`
	// Joined fields for display
	GPUTypeName   string `json:"gpu_type_name"`
	ProviderName  string `json:"provider_name"`
}

func initDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./gpu_prices.db")
	if err != nil {
		return nil, err
	}

	// Create tables
	if err := createTables(db); err != nil {
		return nil, err
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	// GPU Types table
	gpuTypesTable := `
	CREATE TABLE IF NOT EXISTS gpu_types (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		manufacturer TEXT NOT NULL,
		memory TEXT NOT NULL,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL
	);`

	// Providers table
	providersTable := `
	CREATE TABLE IF NOT EXISTS providers (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		website TEXT,
		country TEXT,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL
	);`

	// GPU Prices table
	gpuPricesTable := `
	CREATE TABLE IF NOT EXISTS gpu_prices (
		id TEXT PRIMARY KEY,
		gpu_type_id TEXT NOT NULL,
		provider_id TEXT NOT NULL,
		price REAL NOT NULL,
		currency TEXT NOT NULL DEFAULT 'USD',
		date TEXT NOT NULL,
		in_stock BOOLEAN NOT NULL DEFAULT 1,
		url TEXT,
		created_at TEXT NOT NULL,
		updated_at TEXT NOT NULL,
		FOREIGN KEY (gpu_type_id) REFERENCES gpu_types (id) ON DELETE CASCADE,
		FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
	);`

	// Execute table creation
	if _, err := db.Exec(gpuTypesTable); err != nil {
		return err
	}
	if _, err := db.Exec(providersTable); err != nil {
		return err
	}
	if _, err := db.Exec(gpuPricesTable); err != nil {
		return err
	}

	log.Println("Database tables created successfully")
	return nil
}

func getCurrentTime() string {
	return time.Now().UTC().Format("2006-01-02T15:04:05Z")
}