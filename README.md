# HNG Profile Intelligence Service - Stage 1

A production-ready REST API for profile enrichment and management. This system integrates multiple external APIs to enrich names with gender, age, and nationality predictions, storing all results in PostgreSQL.

**Version:** `1.0.0` (Stage 1 - Complete Implementation)

## Table of Contents

- [Features](#features)
- [Overview](#overview)
- [Prerequisites & Installation](#prerequisites--installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)

## Features

- **Multi-API Integration**: Genderize, Agify, and Nationalize APIs for comprehensive enrichment
- **PostgreSQL Database**: Persistent data storage with automatic schema management
- **Profile Management**: Create, retrieve, filter, and delete profiles
- **Idempotency**: Duplicate name submissions return existing profile without re-processing
- **Advanced Filtering**: Filter profiles by gender, country, and age group
- **UUID v7 Generation**: Timestamp-based unique identifiers for all profiles
- **CORS Enabled**: Cross-origin requests fully supported
- **Robust Error Handling**: Proper HTTP status codes with descriptive messages
- **Type-Safe**: Full TypeScript strict mode implementation
- **Production Ready**: PM2 configuration for VPS deployment

## Overview

The Profile Intelligence Service accepts a name and enriches it using three external APIs:

- **Genderize.io** - Gender prediction with probability scoring
- **Agify.io** - Age prediction and age group classification
- **Nationalize.io** - Country/nationality prediction

All data is persisted in PostgreSQL with automatic duplicate detection (case-insensitive).

## Prerequisites & Installation

### Requirements

- **Node.js** v16+
- **pnpm** v8+ (or npm/yarn)
- **PostgreSQL** 12+
- **Git**

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/icekidtech/genderize-classifier-stage-one.git
   cd stage-one
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Build the project:**
   ```bash
   pnpm build
   ```

## Configuration

### Environment Variables

Create a `.env` file in the project root. Copy from `.env.example`:

```bash
cp .env.example .env
```

**Required variables:**
```env
# Application
NODE_ENV=development
PORT=5000

# PostgreSQL (Option 1: Connection string - recommended)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/genderize_stage1

# PostgreSQL (Option 2: Individual parameters)
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_NAME=genderize_stage1

# External APIs (optional - uses defaults if not set)
GENDERIZE_API_URL=https://api.genderize.io
AGIFY_API_URL=https://api.agify.io
NATIONALIZE_API_URL=https://api.nationalize.io
```

### Database Setup

1. **Create the database locally:**
   ```bash
   createdb genderize_stage1
   ```

2. **Or define custom connection in .env:**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/custom_db_name
   ```

3. **Migrations will run automatically on server start.**

## Running the Server

### Development Mode (Hot Reload)

```bash
pnpm dev
```

Server runs on `http://localhost:5000` by default.

### Production Build & Start

```bash
pnpm build
pnpm start
```

### Custom Port

```bash
PORT=3000 pnpm dev
# or
PORT=3000 pnpm start
```

## API Endpoints

### Health Check

```bash
GET /health

Response: {"status": "ok"}
```

### Create Profile

**Endpoint:** `POST /api/profiles`

**Request:**
```bash
curl -X POST http://localhost:5000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name": "ella"}'
```

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 46,
    "age_group": "adult",
    "country_id": "DRC",
    "country_probability": 0.85,
    "created_at": "2026-04-17T12:00:00.000Z"
  }
}
```

**Idempotency (Duplicate Name - 200):**
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { ...existing profile... }
}
```

### Get Profile by ID

**Endpoint:** `GET /api/profiles/{id}`

**Request:**
```bash
curl http://localhost:5000/api/profiles/b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emmanuel",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 25,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.85,
    "created_at": "2026-04-17T12:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Profile not found"
}
```

### List Profiles

**Endpoint:** `GET /api/profiles`

**Without Filters:**
```bash
curl http://localhost:5000/api/profiles
```

**With Filters:**
```bash
curl "http://localhost:5000/api/profiles?gender=male&country_id=NG&age_group=adult"
```

**Success Response (200):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "tunde",
      "gender": "male",
      "age": 32,
      "age_group": "adult",
      "country_id": "NG"
    }
  ]
}
```

### Delete Profile

**Endpoint:** `DELETE /api/profiles/{id}`

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/profiles/b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12
```

**Success Response (204):** No Content

**Error Response (404):**
```json
{
  "status": "error",
  "message": "Profile not found"
}
```

## Testing

```bash
pnpm test
```

Tests cover:
- Profile creation with multi-API enrichment
- Idempotency verification
- Filtering (gender, country, age group)
- Error handling (validation, not found, API failures)
- Delete operations

## Project Structure

```
stage-one/
├── src/
│   ├── main.ts                      # Entry point
│   ├── database.ts                  # TypeORM configuration
│   ├── middleware/
│   │   └── index.middleware.ts      # CORS middleware
│   ├── routes/
│   │   ├── health.routes.ts         # Health check
│   │   └── profiles.routes.ts       # Profile management
│   ├── services/
│   │   ├── genderize.services.ts    # Genderize API
│   │   ├── agify.services.ts        # Agify API
│   │   ├── nationalize.services.ts  # Nationalize API
│   │   └── profiles.services.ts     # Profile orchestration
│   ├── entities/
│   │   └── Profile.ts               # TypeORM Profile entity
│   ├── repositories/
│   │   └── ProfileRepository.ts     # Database access layer
│   ├── migrations/
│   │   └── *-CreateProfilesTable.ts # Database migrations
│   ├── types/
│   │   └── index.types.ts           # TypeScript interfaces
│   └── utils/
│       └── helpers.utils.ts         # Helper functions
├── tests/
│   └── profiles.test.ts             # Integration tests
├── dist/                            # Compiled output
├── .env.example                     # Environment template
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── ecosystem.config.js              # PM2 config
└── README.md                        # This file
```

## Error Handling

| Status | Condition | Response |
|--------|-----------|----------|
| 200 | Success or idempotent | `{"status": "success", "data": {...}}` |
| 201 | Created | `{"status": "success", "data": {...}}` |
| 204 | Deleted (No Content) | (empty) |
| 400 | Bad Request (missing/empty name) | `{"status": "error", "message": "..."}` |
| 404 | Not Found | `{"status": "error", "message": "Profile not found"}` |
| 422 | Unprocessable Entity (invalid type) | `{"status": "error", "message": "Name must be a string"}` |
| 500 | Server Error | `{"status": "error", "message": "Internal server error"}` |
| 502 | External API Error | `{"status": "error", "message": "{API} returned an invalid response"}` |

### Edge Case Handling

- **Genderize returns null gender or count=0**: Returns 502 error, profile not created
- **Agify returns null age**: Returns 502 error, profile not created
- **Nationalize returns no countries**: Returns 502 error, profile not created

## Deployment

### VPS Deployment with PM2

**Quick PM2 Setup:**

```bash
# Install PM2 globally (once)
npm install -g pm2

# Start the app
pm2 start ecosystem.config.js

# View logs
pm2 logs genderize-classifier-stage-one

# Setup auto-restart
pm2 startup
pm2 save
```

## Troubleshooting

### PostgreSQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Ensure PostgreSQL is running on your system
2. Verify `DATABASE_URL` in `.env` matches your PostgreSQL instance
3. Create the database: `createdb genderize_stage1`

### Port Already in Use

```bash
# Change to a different port
PORT=3000 pnpm dev
```

### External API Timeout

If external APIs are timing out:
1. Check your internet connection
2. Verify the API endpoints are accessible
3. Increase timeout in `.env`: `API_TIMEOUT=10000` (10 seconds)

### Database Schema Issues

```bash
# Restart the app to trigger schema sync
pnpm dev
```

TypeORM will automatically create/update the schema based on entities.

## License

ISC
