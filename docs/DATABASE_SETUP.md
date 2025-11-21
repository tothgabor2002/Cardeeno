# Database Setup Guide - Supabase + Prisma

This guide will help you set up PostgreSQL database using Supabase for the Cardeeno project.

## Option 1: Supabase (Recommended for Production)

Supabase provides a managed PostgreSQL database with a generous free tier.

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Project

1. Click "New Project"
2. Choose your organization or create a new one
3. Fill in project details:
   - **Project name**: `cardeeno` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect to start

4. Click "Create new project" (takes ~2 minutes to provision)

### Step 3: Get Database Connection String

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click **Database** in the settings menu
3. Scroll to **Connection string** section
4. Select **URI** tab
5. Copy the connection string (it looks like this):

   ```
   postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres
   ```

6. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase connection string:

   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"
   ```

3. Generate a NextAuth secret:

   ```bash
   openssl rand -base64 32
   ```

4. Add it to `.env.local`:
   ```env
   NEXTAUTH_SECRET="your-generated-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Step 5: Run Prisma Migrations

Now that your database is configured, run the migrations:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed database with sample data
npx prisma db seed
```

### Step 6: Verify Setup

Open Prisma Studio to view your database:

```bash
npx prisma studio
```

This will open a GUI at `http://localhost:5555` where you can browse:

- Users table
- Sets table (study sets)
- Cards table
- StudySessions table

You should see the seeded data:

- 1 demo user
- 3 study sets (German, Spanish, French)
- 24 cards total
- 1 study session

## Option 2: Local PostgreSQL

If you prefer to run PostgreSQL locally:

### Install PostgreSQL

**Windows:**

1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Set password for postgres user
4. Remember the port (default: 5432)

**Mac (Homebrew):**

```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cardeeno;

# Exit
\q
```

### Configure Connection String

Update `.env.local`:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/cardeeno"
```

Then run migrations:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## Option 3: Docker PostgreSQL

Quick setup using Docker:

```bash
# Start PostgreSQL container
docker run --name cardeeno-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=cardeeno \
  -p 5432:5432 \
  -d postgres:15

# Configure .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/cardeeno"

# Run migrations
npx prisma migrate dev --name init
npx prisma db seed
```

## Troubleshooting

### Connection Refused

**Issue**: `Error: connect ECONNREFUSED`

**Solutions**:

1. Check database is running
2. Verify connection string is correct
3. Check firewall rules
4. For Supabase: Verify password has no special characters causing issues

### SSL Required

**Issue**: `Error: SSL required`

**Solution**: Add `?sslmode=require` to connection string:

```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### Migration Failed

**Issue**: Migration errors

**Solutions**:

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually drop tables and re-migrate
npx prisma migrate dev --name init
```

### Can't Connect to Supabase

**Issue**: Connection timeout

**Solutions**:

1. Check your IP is allowed (Supabase → Settings → Database → Connection pooling)
2. Try direct connection vs connection pooling
3. Check if you're behind a firewall

## Useful Prisma Commands

```bash
# View current database
npx prisma studio

# Create new migration
npx prisma migrate dev --name description

# Apply migrations (production)
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Push schema without migrations (dev only)
npx prisma db push
```

## Database Schema

Your database has 4 tables:

### users

- Stores user accounts
- Relations: hasMany sets, hasMany studySessions

### sets

- Study sets created by users
- Contains: title, description, isPublic
- Relations: belongsTo user, hasMany cards, hasMany studySessions

### cards

- Individual flashcards within sets
- Contains: term, definition, orderIndex
- Relations: belongsTo set

### study_sessions

- Tracks user study progress
- Contains: mode, score, completedCards, totalCards
- Relations: belongsTo user, belongsTo set

## Next Steps

Once your database is set up:

1. ✅ Verify tables exist in Prisma Studio
2. ✅ Check seeded data is present
3. 🔄 Set up NextAuth.js for authentication
4. 🔄 Build API routes using Prisma
5. 🔄 Create frontend components

## Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **GitHub Issues**: Open an issue in the repository

---

**Tip**: For production, always use Supabase connection pooling for better performance:

- Settings → Database → Connection Pooling → Transaction mode
