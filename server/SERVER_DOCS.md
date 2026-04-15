# Grandma's Cookbook — Complete Backend Documentation

---

## Table of Contents

1. [What the Backend Is and Why It Exists](#1-what-the-backend-is-and-why-it-exists)
2. [Tech Stack — Every Tool Explained](#2-tech-stack--every-tool-explained)
3. [Folder Structure — What Lives Where and Why](#3-folder-structure--what-lives-where-and-why)
4. [Environment Variables — The Secret Configuration](#4-environment-variables--the-secret-configuration)
5. [The Entry Point — index.js](#5-the-entry-point--indexjs)
6. [The Database Layer](#6-the-database-layer)
   - [Connection Pool — db/pool.js](#connection-pool--dbpooljs)
   - [Seeding — db/seed.js](#seeding--dbseedjs)
7. [The Routes Layer — How URLs Are Mapped](#7-the-routes-layer--how-urls-are-mapped)
8. [The Controllers Layer — Where Logic Lives](#8-the-controllers-layer--where-logic-lives)
   - [Recipes Controller](#recipes-controller--controllersrecipesjs)
   - [Auth Controller](#auth-controller--controllersauthjs)
   - [Users Controller](#users-controller--controllersuserjs)
   - [Upload Controller](#upload-controller--controllersuploadjs)
   - [Reference Controller](#reference-controller--controllersreferencejs)
9. [The Services Layer — Talking to External APIs](#9-the-services-layer--talking-to-external-apis)
10. [Authentication System — Deep Dive](#10-authentication-system--deep-dive)
    - [Middleware — middleware/auth.js](#middleware--middlewareauthjs)
    - [Local Auth (Email + Password)](#local-auth-email--password)
    - [Google OAuth — config/passport.js](#google-oauth--configpassportjs)
11. [Key Engineering Concepts Explained](#11-key-engineering-concepts-explained)
    - [What is a Connection Pool?](#what-is-a-connection-pool)
    - [What is a Database Transaction?](#what-is-a-database-transaction)
    - [What are Parameterized Queries?](#what-are-parameterized-queries)
    - [What is a JWT?](#what-is-a-jwt)
    - [What is bcrypt?](#what-is-bcrypt)
    - [What is CORS?](#what-is-cors)
    - [What is Middleware?](#what-is-middleware)
12. [The Full Request Lifecycle — A Recipe Creation Walk-Through](#12-the-full-request-lifecycle--a-recipe-creation-walk-through)
13. [Complete API Reference](#13-complete-api-reference)
14. [Running the Server](#14-running-the-server)

---

## 1. What the Backend Is and Why It Exists

The frontend (the React app the user sees in their browser) cannot safely talk to a database directly. Databases should never be exposed to the public internet — if they were, anyone could connect and read or delete everything. The backend is the trusted intermediary that sits between the browser and the database.

The backend is a **REST API** — a web server that listens for HTTP requests, runs business logic, talks to the database, and sends back JSON responses. The frontend sends requests to it, and it replies with data.

```
Browser (React)  <——HTTP——>  Backend (Express)  <——SQL——>  MySQL (Railway)
                                    |
                             Cloudinary (images)
```

The backend is built with **Node.js** and runs as a completely separate process from the React frontend. Both run at the same time locally:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

In production, they would be deployed to separate servers.

---

## 2. Tech Stack — Every Tool Explained

| Tool | Version | What It Does |
|---|---|---|
| **Node.js** | Runtime | Runs JavaScript outside of the browser. It's the engine that executes all the backend code. |
| **Express 5** | Framework | A minimal web framework that makes it easy to define routes (URL patterns) and handle HTTP requests. Without Express you'd have to write raw Node.js HTTP server code, which is verbose. |
| **mysql2** | DB Driver | The library that lets Node.js connect to and query a MySQL database. Uses the Promise-based API so we can use `async/await` instead of nested callbacks. |
| **dotenv** | Config | Reads a `.env` file and injects its key-value pairs into `process.env` so the app can access secrets without them being hardcoded in code. |
| **cors** | Middleware | "Cross-Origin Resource Sharing" — browsers block requests from one domain to another by default (a security feature). This middleware tells the browser it's allowed to send requests from `localhost:5173` to `localhost:3000`. |
| **bcryptjs** | Security | Hashes passwords before storing them. A hash is a one-way transformation — you can verify a password against a hash but you cannot reverse the hash back to the original password. |
| **jsonwebtoken** | Auth | Creates and verifies JSON Web Tokens (JWTs) — the signed tokens users carry around to prove they are logged in. |
| **passport** | Auth | A middleware framework for handling authentication strategies. We use it specifically for Google OAuth. |
| **passport-google-oauth20** | Auth | The specific Passport strategy that handles the Google OAuth 2.0 flow. |
| **cloudinary** | Image Storage | The official Cloudinary SDK that lets us upload images to their CDN (Content Delivery Network) and get back a public URL. |
| **multer** | File Handling | Middleware that parses `multipart/form-data` requests (the format browsers use to upload files). It holds the uploaded file in memory as a buffer before we send it to Cloudinary. |
| **nodemon** | Dev Tool | Watches all `.js` files and automatically restarts the server whenever you save a change. Only used during development. |

---

## 3. Folder Structure — What Lives Where and Why

```
server/
├── index.js                  ← Entry point. Boots the whole server.
├── package.json              ← Backend dependencies. SEPARATE from the frontend's package.json.
├── .env                      ← Secret credentials. Never committed to git.
├── .gitignore                ← Tells git to ignore node_modules/ and .env
│
├── db/
│   ├── pool.js               ← Creates the shared database connection pool. Imported everywhere.
│   ├── seed.js               ← Populates the database with reference data (cuisines, tags, etc.)
│   └── migrate.js            ← One-time script that fixed a missing ON DELETE CASCADE on the
│                                ingredients table foreign key.
│
├── config/
│   └── passport.js           ← Configures the Google OAuth strategy for Passport.
│
├── middleware/
│   └── auth.js               ← requireAuth: checks that the request includes a valid JWT token.
│
├── routes/
│   ├── recipes.js            ← Declares which URL patterns map to which controller functions.
│   ├── auth.js               ← Same, for /api/auth/* endpoints.
│   ├── users.js              ← Same, for /api/users/* endpoints.
│   ├── reference.js          ← Same, for /api/reference/* endpoints.
│   └── upload.js             ← Same, for /api/upload. Also applies multer middleware here.
│
├── controllers/
│   ├── recipes.js            ← All logic for creating, reading, updating, deleting recipes.
│   ├── auth.js               ← Logic for register, login, and token generation.
│   ├── users.js              ← Logic for saving/unsaving/listing saved recipes.
│   ├── reference.js          ← Logic for fetching cuisines, meal types, and tags.
│   └── upload.js             ← Logic for receiving a file and sending it to Cloudinary.
│
└── services/
    └── cloudinary.js         ← Wraps the Cloudinary SDK's upload function in a clean Promise.
```

**Why is it split this way?**

The separation of routes, controllers, and services is called the **separation of concerns** pattern. Each file has one job:
- **Routes** only care about "what URL does what"
- **Controllers** only care about "what SQL do I run and what do I return"
- **Services** only care about "how do I talk to this external API"

This makes the code easier to navigate, test, and modify. If Cloudinary changes their API, you only touch `services/cloudinary.js`.

---

## 4. Environment Variables — The Secret Configuration

File: `server/.env`

```
DATABASE_URL=mysql://<user>:<pass>@<host>:<port>/railway
JWT_SECRET=<long random string>
CLOUDINARY_CLOUD_NAME=<from Cloudinary dashboard>
CLOUDINARY_API_KEY=<from Cloudinary dashboard>
CLOUDINARY_API_SECRET=<from Cloudinary dashboard>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
FRONTEND_URL=http://localhost:5173
```

**Why environment variables?**

Credentials like database passwords and API keys must never be hardcoded in source code. If code is shared, pushed to GitHub, or inspected by anyone, the secrets would be exposed. Environment variables keep secrets out of code. The `.gitignore` file ensures `.env` is never committed to git.

`dotenv` reads this file on startup (`require('dotenv').config()`) and makes every key available as `process.env.DATABASE_URL`, `process.env.JWT_SECRET`, etc.

---

## 5. The Entry Point — index.js

```
server/index.js
```

This is the first file that runs when you start the server. It has four jobs:

1. **Load environment variables** — `require('dotenv').config()` runs first so all `process.env.*` values are available.
2. **Create the Express app** — `const app = express()` creates the application instance.
3. **Register middleware** — middleware runs on every single request before it reaches any route handler:
   - `cors()` — allows the frontend to make requests to this server.
   - `express.json()` — parses the JSON body of incoming requests so you can read `req.body`.
   - `passport.initialize()` — initializes Passport so the Google OAuth strategy is ready.
4. **Mount routers** — tells Express which router to use for which URL prefix:
   ```js
   app.use('/api/recipes',   require('./routes/recipes'));
   app.use('/api/auth',      require('./routes/auth'));
   app.use('/api/users',     require('./routes/users'));
   app.use('/api/reference', require('./routes/reference'));
   app.use('/api/upload',    require('./routes/upload'));
   ```
   When a request comes in for `/api/recipes/5`, Express sees it starts with `/api/recipes` and hands it to `routes/recipes.js`, which then matches `/:id` and calls `getRecipeById`.
5. **Start listening** — `app.listen(3000)` opens the server on port 3000.

---

## 6. The Database Layer

### Connection Pool — db/pool.js

```js
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool;
```

This file creates one pool and exports it. Every controller imports this same pool object — there is only ever one pool instance for the entire server. See [Section 11](#what-is-a-connection-pool) for an explanation of why pools exist.

Key settings:
- `connectionLimit: 10` — at most 10 simultaneous open connections to MySQL.
- `waitForConnections: true` — if all 10 are busy, new requests wait in line rather than failing immediately.
- `queueLimit: 0` — the waiting queue has no size limit.

### Seeding — db/seed.js

Seeding means populating the database with initial data. `seed.js` inserts all reference data — the fixed lists of options that users pick from in dropdowns.

**What it seeds:**
- **Cuisines** (15 options): American, Italian, Mexican, Chinese, Japanese, Indian, French, Greek, Thai, Mediterranean, Spanish, Middle Eastern, Korean, Vietnamese, Other.
- **Meal Types** (8 options): Breakfast, Lunch, Dinner, Dessert, Snack, Appetizer, Side Dish, Drink.
- **Dietary Tags** (14 options): Vegan, Vegetarian, Gluten-Free, Dairy-Free, Nut-Free, Keto, Paleo, Low-Carb, High-Protein, Quick, Easy, Spicy, Kid-Friendly, Healthy.
- **Test User**: A `testuser` account with email `test@test.com` is created for development testing.

**Why `INSERT IGNORE`?**

For cuisines, meal types, and tags, the seed uses `INSERT IGNORE`. This means: "insert this row, but if a row with this unique value already exists, silently skip it instead of throwing an error." This makes the seed script safe to run multiple times — it won't duplicate data.

The test user uses `DELETE` first (to reset it cleanly) and then `INSERT`.

Run with: `node db/seed.js`

---

## 7. The Routes Layer — How URLs Are Mapped

Routes are the address book of the API. Each route file says: "for this HTTP method + URL pattern, call this function."

### routes/recipes.js

```js
router.get('/',     getRecipes);               // GET  /api/recipes
router.get('/:id',  getRecipeById);            // GET  /api/recipes/5
router.post('/',    requireAuth, createRecipe);// POST /api/recipes
router.put('/:id',  requireAuth, updateRecipe);// PUT  /api/recipes/5
router.delete('/:id', requireAuth, deleteRecipe); // DELETE /api/recipes/5
```

Note that `GET` routes have no `requireAuth` — anyone can view recipes without being logged in. Write operations (POST, PUT, DELETE) require authentication.

### routes/auth.js

```js
router.post('/register', register);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    const { token } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});
```

The Google OAuth routes use Passport directly in the route definition. `scope: ['profile', 'email']` tells Google what information we want access to. `session: false` tells Passport not to use server-side sessions — we use JWTs instead.

### routes/users.js

```js
router.post('/:id/save',          requireAuth, saveRecipe);
router.delete('/:id/save',        requireAuth, unsaveRecipe);
router.get('/:id/saved-recipes',  requireAuth, getSavedRecipes);
```

Here `:id` is the **recipe ID** for save/unsave, and the **user ID** for saved-recipes. All three require authentication.

### routes/upload.js

The upload route applies `multer` middleware before the controller:
- `multer({ storage: memoryStorage() })` — stores the uploaded file in RAM as a buffer (never touches the disk).
- `.single('image')` — expects exactly one file in a field named `image`.
- Max file size: 5MB.
- Only `image/*` MIME types are accepted.

---

## 8. The Controllers Layer — Where Logic Lives

### Recipes Controller — controllers/recipes.js

This is the most complex controller. It handles all recipe operations.

---

#### `getRecipes` — GET /api/recipes

Fetches a list of recipes with optional filters. The key technique here is **dynamic WHERE clause building**:

```js
const conditions = ['1=1'];
const params = [];

if (search)    { conditions.push('r.name LIKE ?');     params.push(`%${search}%`); }
if (cuisine)   { conditions.push('r.cuisine_type = ?'); params.push(cuisine); }
if (meal_type) { conditions.push('r.meal_type = ?');    params.push(meal_type); }
if (tags) {
    const tagIds = tags.split(',').map(Number);
    const placeholders = tagIds.map(() => '?').join(',');
    conditions.push(`r.id IN (SELECT recipe_id FROM tags_recipes WHERE tag_id IN (${placeholders}))`);
    params.push(...tagIds);
}

const whereClause = conditions.join(' AND ');
```

Starting with `['1=1']` is a programming trick. `1=1` is always true, so it acts as a "do nothing" condition. Every real filter is then appended with `AND`. This avoids awkward logic like "is this the first condition or not?"

The tag filter uses a **subquery**: `r.id IN (SELECT recipe_id FROM tags_recipes WHERE tag_id IN (...))`. This says "give me recipes whose ID appears in the tag junction table for any of these tag IDs."

The full SQL query JOINs four tables to get the cuisine name, meal type name, and author username — instead of just returning raw IDs that the frontend would have to look up separately.

---

#### `getRecipeById` — GET /api/recipes/:id

Fetches one recipe in full detail. It runs **four separate queries** and stitches the results together:

1. Main recipe row (name, times, servings, etc.) with JOINs for cuisine, meal type, author.
2. All ingredients for that recipe ID.
3. All instructions ordered by `step_num`.
4. All tags via the `tags_recipes` junction table.

The final response is built by spreading the recipe object and adding the three arrays:
```js
const recipe = { ...recipes[0], ingredients, instructions, tags };
```

---

#### `createRecipe` — POST /api/recipes

This is the most important function in the backend. It uses a **database transaction** to create a recipe across four tables atomically.

Step by step:
1. `pool.getConnection()` — checks out a dedicated connection from the pool. Transactions require a single connection throughout.
2. `connection.beginTransaction()` — starts the transaction. All queries from here are tentative.
3. `INSERT INTO recipes ...` — inserts the main recipe row. Gets back `result.insertId` (the new recipe's auto-generated ID).
4. `INSERT INTO ingredients ... VALUES ?` — bulk inserts all ingredients in one query. The `?` here accepts a 2D array: `[[recipeId, 'desc1'], [recipeId, 'desc2'], ...]`.
5. `INSERT INTO instructions ... VALUES ?` — same bulk insert, but adds `step_num` (the array index + 1).
6. `INSERT INTO tags_recipes ... VALUES ?` — links tag IDs to the recipe in the junction table.
7. `connection.commit()` — makes all changes permanent.
8. If any step fails: `connection.rollback()` — undoes everything. The database stays clean.
9. `connection.release()` — returns the connection to the pool (in `finally` so it always runs).

The `user_id` comes from `req.user.id` — the decoded JWT payload set by the `requireAuth` middleware. The user never sends their own ID; the server reads it from the verified token.

---

#### `updateRecipe` — PUT /api/recipes/:id

Uses the same transaction pattern. The update strategy for related data is **delete and reinsert**:
1. UPDATE the main recipe row.
2. DELETE all ingredients, instructions, and tag links for this recipe.
3. Re-INSERT them all fresh from the request body.

This is simpler than diffing the old and new lists and is safe because all those deletions are wrapped in the same transaction.

The `WHERE id = ? AND user_id = ?` clause on the UPDATE ensures a user can only update their own recipes. If the WHERE clause matches nothing (wrong user or wrong ID), `affectedRows` would be 0 — though the current code doesn't check this explicitly, the data remains unchanged.

---

#### `deleteRecipe` — DELETE /api/recipes/:id

```js
const [result] = await pool.query('DELETE FROM recipes WHERE id = ? AND user_id = ?', [id, req.user.id]);
if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Recipe not found' });
}
```

Deletes the recipe only if the logged-in user owns it. `ON DELETE CASCADE` on the database foreign keys means MySQL automatically deletes all related ingredients, instructions, and tag links when the recipe row is deleted. No manual cleanup needed.

`affectedRows === 0` catches both "recipe doesn't exist" and "recipe exists but you don't own it" — both return a 404.

---

### Auth Controller — controllers/auth.js

#### `generateToken`

```js
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};
```

Creates a JWT containing the user's `id` and `username`, signed with our secret key, valid for 7 days. The payload (`id`, `username`) is embedded in the token itself — we don't need to hit the database to find out who a user is on every request.

---

#### `register`

1. Check if the email or username already exists. Return 409 Conflict if so.
2. Hash the password with bcrypt at cost factor 12 (see [Section 11](#what-is-bcrypt)).
3. Open a transaction and insert into two tables:
   - `users` — the public user profile (username, email).
   - `user_auth` — the credentials row (links to user, stores `auth_provider: 'local'` and the password hash).
4. Generate and return a JWT immediately — the user is logged in right after registering.

---

#### `login`

1. Find the user by email with a JOIN to `user_auth` (to get the stored hash), filtering to `auth_provider = 'local'` (so Google-only accounts can't log in with a password).
2. `bcrypt.compare(password, hash)` — safely compares the submitted password against the stored hash.
3. If valid, generate and return a JWT.

Both "email not found" and "wrong password" return the same error message ("Invalid email or password") intentionally — this prevents attackers from learning whether an email is registered.

---

### Users Controller — controllers/users.js

#### `saveRecipe`

```js
await pool.query('INSERT IGNORE INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)', [user_id, id]);
```

`INSERT IGNORE` means: if this user already saved this recipe (the `(user_id, recipe_id)` pair already exists), do nothing instead of throwing a duplicate key error. The response is always success — idempotent behavior.

#### `unsaveRecipe`

A simple DELETE from `saved_recipes` matching both user_id and recipe_id. No error if it didn't exist.

#### `getSavedRecipes`

JOINs `saved_recipes` → `recipes` → `cuisines` → `meal_types` → `users` to return a complete list of saved recipe summaries. The query structure mirrors `getRecipes` exactly, filtered by `sr.user_id = ?`.

---

### Upload Controller — controllers/upload.js

```js
const upload = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const image_url = await uploadImage(req.file.buffer);
    res.json({ image_url });
};
```

By the time this function runs, multer has already validated the file type and size and stored the file content in `req.file.buffer` (a raw binary buffer in memory). The controller simply passes that buffer to the Cloudinary service and returns the URL.

---

### Reference Controller — controllers/reference.js

Three simple functions, each running `SELECT id, name FROM <table> ORDER BY name`:

- `getCuisines` → queries `cuisines`
- `getMealTypes` → queries `meal_types`
- `getTags` → queries `tags`

These endpoints exist to populate the filter dropdowns and form selects on the frontend with real data from the database rather than hardcoded lists in the React code.

---

## 9. The Services Layer — Talking to External APIs

### services/cloudinary.js

```js
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'grandmas-cookbook' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(fileBuffer);
    });
};
```

Cloudinary's SDK uses an older callback-based API for streaming uploads. This service wraps it in a `Promise` so the rest of the codebase can use `await uploadImage(buffer)` like any other async function.

`upload_stream` sends the file as a stream (chunk by chunk) rather than all at once. `stream.end(fileBuffer)` feeds the entire buffer into the stream in one go. The callback receives either an error or the upload result, which includes `secure_url` — the `https://` URL of the image on Cloudinary's CDN.

All images go into the `grandmas-cookbook` folder on Cloudinary for organization.

---

## 10. Authentication System — Deep Dive

### Middleware — middleware/auth.js

```js
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
```

This function runs before protected route handlers. It:
1. Reads the `Authorization` header (format: `Bearer eyJhbGci...`).
2. Extracts the token by splitting on the space.
3. `jwt.verify()` checks the token's cryptographic signature using `JWT_SECRET`. If the token was tampered with or has expired, this throws an error.
4. If valid, the decoded payload (containing `id` and `username`) is attached to `req.user`.
5. `next()` passes control to the actual route handler.

Controllers then simply read `req.user.id` to know who is making the request — no database lookup needed.

---

### Local Auth (Email + Password)

**Registration flow:**
```
Client → POST /api/auth/register { username, email, password }
       → Check for duplicates
       → bcrypt.hash(password, 12)
       → Transaction: INSERT users + INSERT user_auth
       → generateToken()
       → Return { token, user }
```

**Login flow:**
```
Client → POST /api/auth/login { email, password }
       → SELECT user JOIN user_auth WHERE email = ? AND auth_provider = 'local'
       → bcrypt.compare(password, password_hash)
       → generateToken()
       → Return { token, user }
```

The token is stored in `localStorage` by the frontend and sent with every subsequent request in the `Authorization: Bearer <token>` header.

---

### Google OAuth — config/passport.js

Google OAuth is a multi-step dance between the browser, our server, and Google's servers:

```
1. User clicks "Sign in with Google"
2. Browser → GET /api/auth/google
3. Server → Redirect browser to Google's login page
4. User logs in on Google
5. Google → GET /api/auth/google/callback?code=XXXX (back to our server)
6. Passport exchanges the code for the user's profile with Google
7. Our GoogleStrategy callback runs:
   a. Check if we've seen this Google ID before → return existing user
   b. Check if the email matches a local account → link Google to it
   c. Otherwise → create a new user
8. generateToken() → create JWT
9. Server → Redirect browser to FRONTEND_URL/auth/callback?token=<jwt>
10. Frontend AuthCallback.tsx reads ?token= from the URL, saves to localStorage
```

The Google Strategy handles three cases in its callback:
- **Returning Google user**: found by `provider_user_id = googleId`. Just generate a token.
- **Email account linking**: the user previously registered with email/password using the same email address. We add a Google row to `user_auth` and return a token — now they can log in with either method.
- **Brand new user**: create a new `users` row and `user_auth` row in a transaction. The user is marked `is_verified: true` automatically because Google verified their email for us.

---

## 11. Key Engineering Concepts Explained

### What is a Connection Pool?

Opening a database connection involves a TCP handshake, authentication, and negotiation — it takes 20–50ms. If the server opened a fresh connection for every HTTP request and closed it when done, each request would carry that overhead, and the database would be overwhelmed by constant connect/disconnect cycles.

A **connection pool** solves this by opening several connections upfront and keeping them alive. When a request needs to query the database, it borrows one of these already-open connections, uses it, and returns it to the pool. The next request borrows the same connection immediately — no setup time.

Think of it like a fleet of taxis already on the road versus calling a car from a garage every time.

Our pool has a limit of 10 connections. If all 10 are in use and an 11th request arrives, it waits in line until one becomes free.

---

### What is a Database Transaction?

A transaction groups multiple SQL statements into one all-or-nothing unit. Either all statements succeed and are permanently saved ("committed"), or if any one fails, all changes are undone ("rolled back") and the database is left exactly as it was before.

**Why this matters for recipe creation:**

Creating a recipe requires inserting into `recipes`, `ingredients`, `instructions`, and `tags_recipes`. If the server inserted the recipe but then crashed before inserting the ingredients, the database would have a broken, incomplete recipe with no ingredients. The next time anyone loaded it, they'd see corrupt data.

With a transaction, if anything fails partway through, the entire operation is rolled back. The half-completed recipe simply disappears and the user gets an error message. The database stays consistent.

```
BEGIN TRANSACTION
  INSERT INTO recipes ...         ← if this fails, nothing gets saved
  INSERT INTO ingredients ...     ← if this fails, the recipe is rolled back too
  INSERT INTO instructions ...
  INSERT INTO tags_recipes ...
COMMIT                            ← only here do changes become permanent
```

---

### What are Parameterized Queries?

**Never do this:**
```js
pool.query(`SELECT * FROM users WHERE email = '${email}'`)
```

If `email` is `' OR '1'='1`, the query becomes:
```sql
SELECT * FROM users WHERE email = '' OR '1'='1'
```
This returns every user in the database. This attack is called **SQL Injection** and is one of the most common security vulnerabilities in web applications.

**Always do this:**
```js
pool.query('SELECT * FROM users WHERE email = ?', [email])
```

The `?` is a placeholder. The `mysql2` library sends the query and the values separately to the database. MySQL treats the value as pure data — it can never be interpreted as SQL code, no matter what the user typed. Parameterized queries completely prevent SQL injection.

---

### What is a JWT?

A **JSON Web Token** is a compact, self-contained, cryptographically signed token. It has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciJ9.SIGNATURE
     HEADER                          PAYLOAD                          SIGNATURE
```

- **Header**: says which signing algorithm was used (HS256).
- **Payload**: contains the actual data — `{ id: 1, username: "testuser", exp: 1234567890 }`. This is **Base64-encoded, not encrypted** — anyone can decode and read it. Never put sensitive data in the payload.
- **Signature**: a cryptographic hash of the header + payload, signed with `JWT_SECRET`. This cannot be forged without knowing the secret.

When a user sends a token, the server re-signs the header and payload with its own secret and checks that the signature matches. If anyone tampers with the payload (e.g., changing `id: 1` to `id: 999`), the signature won't match and the token is rejected.

This means the server never needs to look up "is this session still valid?" in a database — it just mathematically verifies the signature. Stateless authentication at scale.

---

### What is bcrypt?

bcrypt is a password hashing algorithm designed to be slow on purpose. A regular hash like MD5 or SHA256 can hash billions of passwords per second on modern hardware, making brute-force attacks feasible. bcrypt includes a configurable "cost factor" that controls how much work is required to compute one hash.

At cost factor 12 (our setting), hashing one password takes ~250ms. That's barely noticeable for a login. But for an attacker trying millions of passwords, it means millions × 250ms = impractical.

bcrypt also automatically salts each hash — it adds a random string to the password before hashing so that two users with the same password get completely different hashes. An attacker cannot use pre-computed tables of common password hashes ("rainbow tables").

`bcrypt.compare(plaintext, hash)` returns `true` or `false` without ever reversing the hash. There is no way to get the original password back from the hash — not even us.

---

### What is CORS?

Browsers enforce a **Same-Origin Policy** — a page at `http://localhost:5173` is normally blocked from making fetch requests to `http://localhost:3000` because the port is different (different origin).

CORS is a mechanism where the server declares which origins it trusts. The `cors()` middleware adds response headers like `Access-Control-Allow-Origin: *` that tell the browser "yes, you're allowed to use this response." Without it, the browser would block every single API request the frontend makes.

In production, you would replace `*` (allow all) with the specific frontend domain for tighter security.

---

### What is Middleware?

Middleware is a function that runs between the incoming request and the final route handler. Express processes middleware in the order it's registered.

```
Request → cors() → express.json() → passport.initialize() → requireAuth() → Controller
```

Each middleware function receives `(req, res, next)`. It can:
- Read or modify `req` (e.g., `requireAuth` adds `req.user`).
- Read or modify `res` (e.g., add headers).
- Call `next()` to pass control to the next middleware.
- Call `res.json()` to end the chain early (e.g., `requireAuth` returns 401 and stops).

This is a powerful pattern because cross-cutting concerns (authentication, logging, parsing) are written once and applied to many routes.

---

## 12. The Full Request Lifecycle — A Recipe Creation Walk-Through

Here is exactly what happens when a logged-in user submits a new recipe:

**1. Frontend sends the request**
```
POST http://localhost:3000/api/recipes
Authorization: Bearer eyJhbGci...
Content-Type: application/json

{
  "name": "Pasta Carbonara",
  "cuisine_id": 2,
  "meal_type_id": 3,
  "prep_time": 10,
  "cook_time": 25,
  "servings": 4,
  "description": "A classic Roman pasta dish",
  "image_url": "https://res.cloudinary.com/...",
  "ingredients": ["400g spaghetti", "200g pancetta", "4 eggs"],
  "instructions": ["Boil salted water", "Fry the pancetta", "Mix eggs"],
  "tag_ids": [2, 14]
}
```

**2. Express receives the request and runs global middleware**
- `cors()` adds CORS headers to the response.
- `express.json()` reads the request body and parses it into `req.body`.

**3. Express matches the route**
- The URL `/api/recipes` matches `app.use('/api/recipes', require('./routes/recipes'))`.
- The method is POST and the path is `/`, so `router.post('/', requireAuth, createRecipe)` matches.

**4. `requireAuth` middleware runs**
- Reads `Authorization: Bearer eyJhbGci...` from headers.
- `jwt.verify()` checks the signature and expiry. Valid.
- Sets `req.user = { id: 1, username: 'testuser' }`.
- Calls `next()`.

**5. `createRecipe` controller runs**
- Reads all fields from `req.body`.
- Calls `pool.getConnection()` — borrows connection #3 from the pool.
- `connection.beginTransaction()` — starts the transaction.
- `INSERT INTO recipes ... VALUES (1, 'Pasta Carbonara', ...)` — `req.user.id` (1) is used for `user_id`. Gets back `recipeId = 7`.
- `INSERT INTO ingredients ... VALUES ?` with `[[7, '400g spaghetti'], [7, '200g pancetta'], [7, '4 eggs']]`.
- `INSERT INTO instructions ... VALUES ?` with `[[7, 1, 'Boil...'], [7, 2, 'Fry...'], [7, 3, 'Mix...']]`.
- `INSERT INTO tags_recipes ... VALUES ?` with `[[2, 7], [14, 7]]`.
- `connection.commit()` — all four inserts are now permanent.
- `connection.release()` — connection #3 returns to the pool.

**6. Response is sent**
```json
HTTP 201 Created
{ "message": "Recipe created", "recipeId": 7 }
```

**7. Frontend redirects**
- `CreateRecipe.tsx` receives the `recipeId` and navigates to `/recipe/7`.

Total time: ~50-150ms.

---

## 13. Complete API Reference

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | None | Returns `{ message: "Grandmas Cookbook API is running" }` |

---

### Recipes — `/api/recipes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/recipes` | None | List all recipes. Supports `?search=`, `?cuisine=`, `?meal_type=`, `?tags=` query params. |
| GET | `/api/recipes/:id` | None | Get full recipe detail including ingredients, instructions, and tags. |
| POST | `/api/recipes` | Required | Create a new recipe. |
| PUT | `/api/recipes/:id` | Required + Owner | Update a recipe. User must own it. |
| DELETE | `/api/recipes/:id` | Required + Owner | Delete a recipe. User must own it. |

**POST/PUT request body:**
```json
{
  "name": "string",
  "prep_time": 10,
  "cook_time": 25,
  "servings": 4,
  "description": "string",
  "cuisine_id": 2,
  "meal_type_id": 3,
  "image_url": "https://...",
  "ingredients": ["string", "string"],
  "instructions": ["string", "string"],
  "tag_ids": [1, 3]
}
```

**GET /api/recipes response:**
```json
[
  {
    "id": 7,
    "name": "Pasta Carbonara",
    "prep_time": 10,
    "cook_time": 25,
    "image_url": "https://...",
    "description": "A classic Roman pasta dish",
    "servings": 4,
    "cuisine": "Italian",
    "meal_type": "Dinner",
    "author": "testuser"
  }
]
```

**GET /api/recipes/:id response:** Same fields plus:
```json
{
  "ingredients": [{ "id": 1, "ingredient_desc": "400g spaghetti" }],
  "instructions": [{ "id": 1, "step_num": 1, "instruction_desc": "Boil salted water" }],
  "tags": [{ "id": 2, "name": "Vegetarian" }]
}
```

---

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Create account. Returns `{ token, user }`. |
| POST | `/api/auth/login` | None | Log in. Returns `{ token, user }`. |
| GET | `/api/auth/google` | None | Redirect to Google login. Open in browser. |
| GET | `/api/auth/google/callback` | None | Google redirects here. Redirects to frontend with token. |

---

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/:id/save` | Required | Save a recipe. `:id` = recipe ID. |
| DELETE | `/api/users/:id/save` | Required | Unsave a recipe. `:id` = recipe ID. |
| GET | `/api/users/:id/saved-recipes` | Required | Get all saved recipes for a user. `:id` = user ID. |

---

### Reference Data — `/api/reference`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reference/cuisines` | None | All cuisines. |
| GET | `/api/reference/meal-types` | None | All meal types. |
| GET | `/api/reference/tags` | None | All dietary tags. |

**Response format (all three):**
```json
[
  { "id": 1, "name": "American" },
  { "id": 2, "name": "Italian" }
]
```

---

### Image Upload — `/api/upload`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Required | Upload image to Cloudinary. |

**Request:** `multipart/form-data`, field name `image`, max 5MB, images only.

**Response:**
```json
{ "image_url": "https://res.cloudinary.com/dXXXXX/image/upload/v.../filename.png" }
```

Use the returned `image_url` in the body of `POST /api/recipes`.

---

## 14. Running the Server

**Start the backend** (from the `server/` directory):
```bash
cd server
npm install     # first time only
npm run dev     # starts nodemon on http://localhost:3000
```

**Start the frontend** (from the project root):
```bash
npm run dev     # starts Vite on http://localhost:5173
```

**One-time setup commands:**
```bash
# From server/
node db/seed.js       # Populate cuisines, meal types, tags, and test user
node db/migrate.js    # Fix ingredients FK (run once after first deploy)
```

**Seeding test recipes** (optional, for development):
```bash
node db/seed-recipes.js testuser
```

**Required environment variables** — create `server/.env`:
```
DATABASE_URL=mysql://<user>:<pass>@<host>:<port>/railway
JWT_SECRET=<any long random string>
CLOUDINARY_CLOUD_NAME=<from Cloudinary>
CLOUDINARY_API_KEY=<from Cloudinary>
CLOUDINARY_API_SECRET=<from Cloudinary>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
FRONTEND_URL=http://localhost:5173
```
