# Forum API

A RESTful forum API built with **Hapi.js** and **PostgreSQL**, implementing Clean Architecture. Supports user registration, JWT-based authentication, threads, and comments with soft-delete. Built as a Dicoding Back-End Expert submission.

## Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Hapi.js v20
- **Database:** PostgreSQL 14 via `pg`
- **Auth:** JWT (HS256) with `hapi-auth-jwt2`
- **DI Container:** `instances-container`
- **Migrations:** `node-pg-migrate`
- **CI/CD:** GitHub Actions — tests on PRs, deploy to AWS EC2 (PM2) on push to `master`

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- Two databases: one for development, one for tests

### Setup

```bash
npm install
```

Create a `.env` file in the project root (see `.env.example` pattern):

```env
HOST=localhost
PORT=5000

PGHOST=localhost
PGUSER=your_user
PGDATABASE=forumapi
PGPASSWORD=your_password
PGPORT=5432

PGHOST_TEST=localhost
PGUSER_TEST=your_user
PGDATABASE_TEST=forumapi_test
PGPASSWORD_TEST=your_password
PGPORT_TEST=5432

ACCESS_TOKEN_KEY=<64-byte hex string>
REFRESH_TOKEN_KEY=<64-byte hex string>
ACCCESS_TOKEN_AGE=3000
```

Run migrations:

```bash
npm run migrate up             # dev database
npm run migrate:test up        # test database
```

Start the server:

```bash
npm run start:dev   # nodemon (development)
npm start           # production
```

## Running Tests

Tests hit a **real PostgreSQL** database — no mocks. `NODE_ENV=test` tells the pool to use `PG*_TEST` credentials.

```bash
# run full test suite
NODE_ENV=test npm test

# watch mode with coverage report
NODE_ENV=test npm run test:watch

# run a single file
NODE_ENV=test npx jest --setupFiles dotenv/config -i path/to/file.test.js

# run a single test by name
NODE_ENV=test npx jest --setupFiles dotenv/config -i -t "test description"
```

## API Reference

All responses follow `{ status, data }` or `{ status }` envelopes. Protected routes require `Authorization: Bearer <accessToken>`.

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/users` | — | Register a new user |

**POST /users body:** `{ username, password, fullname }`

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/authentications` | — | Login — returns `accessToken` + `refreshToken` |
| `PUT` | `/authentications` | — | Refresh access token |
| `DELETE` | `/authentications` | — | Logout (invalidate refresh token) |

### Threads

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/threads` | Required | Create a thread |
| `GET` | `/threads/{thread_id}` | — | Get thread detail with comments |

**POST /threads body:** `{ title, body }`

**GET /threads/{thread_id}** returns the thread with its full comment list. Deleted comments show content as `**komentar telah dihapus**`.

### Comments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/threads/{thread_id}/comments` | Required | Add a comment |
| `DELETE` | `/threads/{thread_id}/comments/{comment_id}` | Required | Delete own comment (soft-delete) |

**POST .../comments body:** `{ content }`

## Architecture

Four-layer Clean Architecture — dependency direction points inward only.

```
Interfaces/http/api/     → HTTP plugins (Hapi routes + handlers)
Applications/use_case/   → Business logic orchestration
Domains/                 → Abstract repositories + value entities
Infrastructures/         → Postgres repos, JWT, bcrypt, DI container
```

**Key conventions:**
- `Infrastructures/container.js` is the composition root — every new repository or use case must be registered there.
- Entity constructors self-validate and throw uppercase error codes (e.g. `NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY`). `DomainErrorTranslator` maps these to Indonesian-language HTTP errors.
- IDs are `nanoid()`-prefixed by type: `thread-*`, `comment-*`, `user-*`.
- Threads and comments use **soft-delete** (`is_deleted` column). `DELETE /comments` flips the flag; GET responses apply the masking in the `ExistingComment` entity.

## Deployment

CI runs tests on every PR to `master`. Merging to `master` triggers SSH deployment to an EC2 instance:

```
git reset --hard origin/master → npm i → pm2 restart threads-api
```

Required GitHub secrets: `SSH_PRIVATE_KEY`, `SSH_HOST`, `USER_NAME`, `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`, `ACCESS_TOKEN_AGE`.
