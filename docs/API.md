# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.gtek-saas.com/api`

## Authentication
Currently, the API is open for development. Production deployment will include JWT-based authentication.

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Health Check

### GET /health
Check the health status of the API.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "gTek SaaS Global Enterprise Templates"
}
```

## Templates API

### GET /templates/categories
Get all available template categories.

**Response:**
```json
{
  "success": true,
  "categories": ["business", "technical", "compliance", "cosmic"],
  "data": {
    "business": ["Strategic Planning Template", "Business Model Canvas"],
    "technical": ["Software Architecture Blueprint", "API Documentation Template"],
    "compliance": ["GDPR Compliance Framework", "SOX Compliance Template"],
    "cosmic": ["Universal Business Principles", "Quantum Computing Framework"]
  }
}
```

### GET /templates/category/:category
Get templates for a specific category.

**Parameters:**
- `category` (string): Category name (business, technical, compliance, cosmic)

**Response:**
```json
{
  "success": true,
  "category": "business",
  "templates": ["Strategic Planning Template", "Business Model Canvas"]
}
```

### POST /templates/generate
Generate a new template.

**Request Body:**
```json
{
  "category": "business",
  "templateType": "Strategic Planning Template",
  "customization": {
    "company": "Example Corp",
    "industry": "Technology"
  }
}
```

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "template_1640995200000",
    "category": "business",
    "type": "Strategic Planning Template",
    "metadata": {
      "createdAt": "2024-01-01T00:00:00.000Z",
      "version": "1.0.0",
      "compliance": "standard"
    },
    "content": {
      "title": "Strategic Planning Template",
      "description": "Enterprise-grade business template",
      "sections": [...]
    }
  }
}
```

## IDE API

### GET /ide/config
Get IDE configuration and capabilities.

**Response:**
```json
{
  "success": true,
  "ide": {
    "editor": {
      "languages": ["javascript", "typescript", "python", "solidity"],
      "features": ["syntax-highlighting", "auto-completion"]
    },
    "terminal": {
      "environments": ["nodejs", "python", "docker"],
      "commands": ["build", "test", "deploy"]
    }
  },
  "version": "4.0.0",
  "type": "Quadrinary IDE"
}
```

### POST /ide/project/create
Create a new project in the IDE.

**Request Body:**
```json
{
  "name": "My Project",
  "type": "web-app",
  "template": "react",
  "framework": "react"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "proj_1640995200000",
    "name": "My Project",
    "type": "web-app",
    "template": "react",
    "framework": "react",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "structure": {...}
  }
}
```

### POST /ide/execute
Execute code in the IDE.

**Request Body:**
```json
{
  "code": "console.log('Hello World');",
  "language": "javascript",
  "environment": "nodejs"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "executionId": "exec_1640995200000",
    "status": "completed",
    "output": "Hello World\nExecution completed successfully.",
    "executionTime": 123.45,
    "memoryUsage": 45.6
  }
}
```

## Compliance API

### GET /compliance/frameworks
Get all available compliance frameworks.

**Response:**
```json
{
  "success": true,
  "frameworks": {
    "GDPR": {
      "name": "General Data Protection Regulation",
      "region": "EU",
      "requirements": ["data_minimization", "consent_management"]
    }
  }
}
```

### POST /compliance/assess
Perform a compliance assessment.

**Request Body:**
```json
{
  "framework": "GDPR",
  "organizationType": "startup",
  "dataTypes": ["personal", "financial"],
  "regions": ["EU", "US"]
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses include details:
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Category and template type are required",
  "code": "VALIDATION_ERROR"
}
```

## Rate Limiting

- 1000 requests per hour per IP address
- 100 requests per minute per IP address

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`