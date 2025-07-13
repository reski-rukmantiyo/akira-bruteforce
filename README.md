# GPU Price Tracker

A full-stack application for tracking GPU prices across different providers. Built with React (frontend) and Go (backend), featuring a SQLite database and Material UI components.

## Features

- **GPU Types Management**: Add, edit, and delete GPU types with manufacturer and memory specifications
- **Provider Management**: Manage different retailers and providers with website and country information
- **Price Tracking**: Record GPU prices with date, currency, stock status, and product URLs
- **Interactive Charts**: Visualize price trends using Plotly.js with filtering by GPU type and provider
- **Modern UI**: Clean and responsive interface built with Material UI

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material UI** for components and styling
- **React Router** for navigation
- **Plotly.js** for data visualization
- **Axios** for API communication

### Backend
- **Go** with Gin framework
- **SQLite** database
- **CORS** support for cross-origin requests
- **UUID** generation for unique IDs

## Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gpu-price-tracker
   ```

2. **Start the backend**
   ```bash
   cd backend
   go mod download
   go run .
   ```
   The backend will be available at `http://localhost:8080`

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

### Using Docker Compose

```bash
docker-compose up --build
```

This will start both services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## API Endpoints

### GPU Types
- `GET /api/gpu-types` - Get all GPU types
- `POST /api/gpu-types` - Create a new GPU type
- `PUT /api/gpu-types/:id` - Update a GPU type
- `DELETE /api/gpu-types/:id` - Delete a GPU type

### Providers
- `GET /api/providers` - Get all providers
- `POST /api/providers` - Create a new provider
- `PUT /api/providers/:id` - Update a provider
- `DELETE /api/providers/:id` - Delete a provider

### GPU Prices
- `GET /api/gpu-prices` - Get all GPU prices (with joined data)
- `POST /api/gpu-prices` - Create a new GPU price
- `PUT /api/gpu-prices/:id` - Update a GPU price
- `DELETE /api/gpu-prices/:id` - Delete a GPU price

## Database Schema

### GPU Types
```sql
CREATE TABLE gpu_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    memory TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### Providers
```sql
CREATE TABLE providers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    country TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

### GPU Prices
```sql
CREATE TABLE gpu_prices (
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
);
```

## Deployment

### Frontend (Vercel)

1. **Connect your repository to Vercel**
2. **Set environment variables**:
   - `REACT_APP_API_URL`: Your backend API URL
3. **Deploy**: Vercel will automatically build and deploy your frontend

### Backend (Railway)

1. **Connect your repository to Railway**
2. **Set environment variables** (if needed):
   - `PORT`: Port number (Railway sets this automatically)
3. **Deploy**: Railway will build and deploy your backend using the Dockerfile

### Alternative: Render

1. **Create a new Web Service on Render**
2. **Connect your repository**
3. **Set build command**: `go build -o main .`
4. **Set start command**: `./main`
5. **Deploy**

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:8080/api`)

### Backend
- `PORT`: Server port (default: `8080`)

## Development

### Project Structure
```
gpu-price-tracker/
├── backend/
│   ├── main.go          # Server entry point
│   ├── database.go      # Database models and initialization
│   ├── handlers.go      # API handlers
│   ├── Dockerfile       # Backend container
│   └── go.mod           # Go dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/       # React page components
│   │   ├── services/    # API service layer
│   │   ├── types/       # TypeScript type definitions
│   │   └── App.tsx      # Main app component
│   ├── Dockerfile       # Frontend container
│   ├── nginx.conf       # Nginx configuration
│   └── package.json     # Node.js dependencies
├── docker-compose.yml   # Local development setup
├── vercel.json         # Vercel deployment config
├── railway.json        # Railway deployment config
└── README.md           # This file
```

### Adding New Features

1. **Backend**: Add new handlers in `handlers.go` and routes in `main.go`
2. **Frontend**: Create new components in `src/pages/` and add routes in `App.tsx`
3. **Database**: Add new tables in `database.go` and update models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
