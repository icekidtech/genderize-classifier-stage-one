# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-04-17 (Stage 1 - Complete Release)

### Added

#### Core Features
- **Multi-API Integration**: Seamless integration with Genderize.io, Agify.io, and Nationalize.io
- **Database Persistence**: PostgreSQL integration with TypeORM and automatic migrations
- **Profile Management**: Complete CRUD operations for profile data
- **Idempotency**: Intelligent duplicate detection (case-insensitive) - duplicate names return existing profile without re-processing
- **Advanced Filtering**: Filter profiles by gender, country_id, and age_group
- **UUID v7 Generation**: Timestamp-based unique identifiers for all profiles
- **CORS Support**: Full cross-origin resource sharing enabled

#### RESTful Endpoints
- `POST /api/profiles` - Create new profile or return existing (idempotent)
- `GET /api/profiles/{id}` - Retrieve single profile by ID
- `GET /api/profiles` - List all profiles with optional filtering
- `DELETE /api/profiles/{id}` - Delete profile (204 No Content response)
- `GET /health` - Health check endpoint

#### Data Processing
- **Gender Prediction**: From Genderize API with probability scoring
- **Age Prediction**: From Agify API with automatic age group classification
  - child (0-12)
  - teenager (13-19)
  - adult (20-59)
  - senior (60+)
- **Country Prediction**: From Nationalize API with highest probability selection
- **Timestamp Management**: Automatic UTC ISO 8601 timestamps with timezone

#### Data Validation & Error Handling
- Input validation (non-empty strings only)
- Edge case handling for null/missing API responses
- HTTP status codes: 400 (Bad Request), 404 (Not Found), 422 (Invalid Type), 502 (Bad Gateway), 204 (No Content)
- Proper error response format: `{"status": "error", "message": "..."}`
- Graceful handling of external API failures

#### Database Schema
- UUID primary key with v7 format
- Case-insensitive name uniqueness (name_lower index)
- Comprehensive field indexing for performance
- Automatic schema synchronization on startup
- Full timezone support for timestamps

#### Documentation
- Comprehensive README with API endpoint documentation
- Contributing guide with development workflow
- Changelog tracking all changes
- Environment configuration examples (.env.example)
- Inline code comments for complex logic

#### Development Infrastructure
- TypeScript strict mode enabled
- Express.js 5.1.0 framework
- TypeORM 0.3.17 for database access
- Axios 1.12.2 for HTTP requests
- PM2 ecosystem configuration for production deployment
- Integration tests with comprehensive coverage
- ESLint-ready code structure

### Technical Details

**Framework & Language:**
- Express 5.1.0
- TypeScript 5.9.3
- Node.js 16+

**Database:**
- PostgreSQL 12+
- TypeORM 0.3.17
- Automatic schema synchronization

**External Dependencies:**
- axios 1.12.2 (HTTP client)
- cors 2.8.5 (CORS middleware)
- uuid 13.0.0 (UUID v7 generation)
- dotenv 17.2.3 (Environment management)
- pg 8.11.3 (PostgreSQL driver)

**Development Tools:**
- ts-node 10.9.2
- TypeScript 5.9.3
- @types packages for type safety

### Database Schema

**profiles table:**
- `id` (UUID v7, PRIMARY KEY)
- `name` (VARCHAR 255)
- `name_lower` (VARCHAR 255, UNIQUE INDEX)
- `gender` (VARCHAR 10, NULLABLE)
- `gender_probability` (NUMERIC 5,4, NULLABLE)
- `sample_size` (INTEGER, NULLABLE)
- `age` (INTEGER, NULLABLE)
- `age_group` (VARCHAR 20, NULLABLE)
- `country_id` (VARCHAR 3, NULLABLE - ISO code)
- `country_probability` (NUMERIC 5,4, NULLABLE)
- `created_at` (TIMESTAMP WITH TIME ZONE)

**Indexes:**
- `idx_name_lower` - Unique index on name_lower for duplicate detection
- `idx_created_at` - Index for sorting and pagination
- `idx_gender` - Index for filtering by gender
- `idx_age_group` - Index for filtering by age group
- `idx_country_id` - Index for filtering by country

### API Response Format

All successful responses follow this structure:
```json
{
  "status": "success",
  "data": { ... profile data ... },
  "message": "Optional message (for idempotency)"
}
```

All error responses:
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Known Limitations

- External API calls are sequential (not queued); high-volume scenarios should consider message queues
- No authentication/authorization implemented (public API)
- No rate limiting on endpoints (add before production use at scale)
- UUID v7 uses timestamp-based implementation (compatible with RFC 9562)

### Testing

- Integration tests cover happy path and error scenarios
- Test suite validates:
  - Profile creation with multi-API enrichment
  - Idempotency (duplicate names)
  - Filtering by gender, country_id, age_group
  - Error handling (400, 404, 422, 502)
  - DELETE operations with 204 responses
  - CORS headers presence
  - Timestamp format validation
  - UUID v7 format compliance

### Deployment

- PM2 ecosystem configuration included
- Auto-restart policies configured
- Production-ready logging setup
- Graceful shutdown handling
- Environment-based configuration management
