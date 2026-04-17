# Contributing Guide

## Development Workflow

This project uses a structured development approach with TypeScript and Express.js.

### Setup Your Local Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/icekidtech/genderize-classifier-stage-one.git
   cd stage-one
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local PostgreSQL connection string
   ```

4. **Create database**
   ```bash
   # PostgreSQL should be running on your machine
   createdb genderize_stage1
   ```

### Working on a Feature

1. **Ensure you're on the latest main**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes, test locally**
   ```bash
   pnpm dev          # Start development server
   pnpm test         # Run tests
   pnpm build        # Verify build succeeds
   ```

4. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "feat: add new endpoint"
   # Use conventional commits: feat:, fix:, docs:, refactor:, test:
   ```

5. **Push to origin**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request** on GitHub
   - Add description of changes
   - Ensure all tests pass

### Code Style & Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Formatting**: 2-space indents
- **Imports**: Organize alphabetically, group by type
- **Error Handling**: Always handle errors explicitly
- **Comments**: Add comments for complex logic only
- **Type Safety**: Use interfaces for all API responses

### Testing

```bash
# Run all tests
pnpm test

# Tests should cover:
# - Happy path (successful profile creation/retrieval)
# - Idempotency (duplicate names)
# - Filtering (gender, country, age_group)
# - Error cases (validation, not found, API failures)
# - Edge cases (null values, empty responses)
```

### Database Migrations

When modifying the schema:

1. Update the entity in `src/entities/Profile.ts`
2. Create a new migration file in `src/migrations/`
3. Implement `up()` and `down()` methods
4. Run: `pnpm typeorm migration:run`

### Before Submitting

- [ ] Code passes TypeScript strict mode
- [ ] All tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] No console errors in dev mode: `pnpm dev`
- [ ] Database schema is synchronized
- [ ] CORS headers are present in responses
- [ ] Error responses match spec format
- [ ] Timestamps are UTC ISO 8601
- [ ] UUIDs are v7 format

## Questions?

Check the README.md for API documentation and troubleshooting guides.
