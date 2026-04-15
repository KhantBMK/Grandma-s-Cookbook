# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Grandma's Cookbook** — a full-stack recipe sharing web app.

- **Frontend**: React + TypeScript + Vite + Tailwind CSS (in project root / `src/`)
- **Backend**: Node.js + Express + MySQL (in `server/` subfolder, CommonJS)
- **Database**: Railway MySQL (remote, accessed via `DATABASE_URL`)
- **Image Storage**: Cloudinary (`grandmas-cookbook` folder)
- **Auth**: Local (email/password with bcrypt + JWT) + Google OAuth 2.0 (Passport.js)

## Development Commands

### Frontend (run from project root)
```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build
```

### Backend (run from `server/` directory)
```bash
cd server
npm run dev        # nodemon index.js, runs on http://localhost:3000
node db/seed.js    # Seed cuisines, meal_types, tags, and test user
```

## Environment Variables

`server/.env` — required keys:
- `DATABASE_URL` — Railway MySQL connection string (no spaces around `=`)
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL` (http://localhost:5173)

## Architecture

### Backend (`server/`)
```
index.js              # Express app entry, mounts all routers
config/passport.js    # Google OAuth strategy, returns JWT in done()
middleware/auth.js    # requireAuth — verifies Bearer JWT, sets req.user
db/pool.js            # mysql2/promise connection pool
db/seed.js            # Idempotent seed (DELETE-then-INSERT for users)
controllers/
  recipes.js          # CRUD with dynamic WHERE building (conditions array)
  auth.js             # register (bcrypt+transaction), login, googleCallback
  users.js            # saveRecipe, unsaveRecipe, getSavedRecipes
  reference.js        # getCuisines, getMealTypes, getTags
routes/
  recipes.js          # GET /, GET /:id, POST / (auth), PUT /:id (auth), DELETE /:id (auth)
  auth.js             # POST /register, POST /login, GET /google, GET /google/callback
  users.js            # POST /:id/save (auth), DELETE /:id/save (auth), GET /:id/saved-recipes (auth)
  reference.js        # GET /cuisines, /meal-types, /tags
  upload.js           # POST / (auth) — Cloudinary upload, returns { image_url }
services/cloudinary.js # uploadImage(buffer) — promisified upload_stream
```

### Frontend (`src/`)
```
api.ts                # Centralized fetch utility; api.get/post/put/delete/upload
                      # auth=true param auto-injects Authorization: Bearer header
context/AuthContext.tsx  # AuthProvider, useAuth() — isLoggedIn, user, login(), logout()
                         # login() saves token+user to localStorage
app/routes.ts         # React Router routes
app/components/
  Navigation.tsx      # Shows Login when logged out, Profile+Logout when logged in
  RecipeCard.tsx      # Recipe thumbnail card (id, name, image_url, cook_time, servings, cuisine, meal_type)
app/pages/
  Home.tsx            # Random recommendation + cuisine filter → /search?cuisine=id
  Search.tsx          # 3 filter dropdowns (Cuisine, Meal Type, Tags) + text search; re-fetches on change
  RecipeDetail.tsx    # Full recipe view; save/unsave (auth); delete (owner only); ingredient scaling (1x–8x)
  CreateRecipe.tsx    # Full form: name, cuisine/meal-type selects, image upload → Cloudinary, 
                      #   times, servings, description, dietary tag toggles, add/edit/delete 
                      #   ingredients and directions; POST /api/recipes on submit; redirects to new recipe
  Profile.tsx         # Shows real user info from useAuth; fetches saved recipes; logout button
  Login.tsx           # Toggle login/register; Google OAuth redirect
  AuthCallback.tsx    # Reads ?token= from URL, decodes JWT, calls login(), redirects to /
  About.tsx           # Static team page
```

### Database Schema (key relationships)
- `recipes` → `recipe_ingredients` (ON DELETE CASCADE), `recipe_instructions` (ON DELETE CASCADE), `recipe_tags` (ON DELETE CASCADE)
- `users` → `user_auth` (password hash), `saved_recipes`
- Reference tables: `cuisines`, `meal_types`, `tags`

### Auth Flow
- **Local**: POST /api/auth/login → JWT → stored in localStorage
- **Google**: redirect to /api/auth/google → Passport callback → redirect to `FRONTEND_URL/auth/callback?token=<jwt>` → `AuthCallback.tsx` saves token

### Recipe Creation Flow
1. (Optional) Upload image via `api.upload('/upload', formData)` → gets `image_url`
2. POST `/api/recipes` with `{ name, description, image_url, cook_time, prep_time, servings, cuisine_id, meal_type_id, tag_ids[], ingredients[], instructions[] }`
3. Backend uses a DB transaction to insert into `recipes`, `recipe_ingredients`, `recipe_instructions`, `recipe_tags`

## Stage 5 Completion Notes
- All frontend pages are fully wired to the real backend API
- Navigation shows Login when logged out, Profile+Logout when logged in (no top margin — uses `mb-6` not `my-6`)
- Home page: 2-column layout (About + Healthy Pick), recommendation filters by "Healthy" tag from `/reference/tags` + `/recipes?tags=<id>`
- Search dropdowns are searchable (type-to-filter input inside each dropdown)
- RecipeDetail checks saved status on load via `GET /api/users/:id/saved-recipes`
- `server/db/seed-recipes.js` — seeds 3 test recipes for any user: `node db/seed-recipes.js <username>`
- Tags list includes "Healthy" (added in seed.js); re-run `node db/seed.js` to add it

## Known Issues / Notes
- `server/` has its own `package.json` (CommonJS `"type": "commonjs"`) separate from the frontend's ESM setup
- Cloudinary images go to `grandmas-cookbook/` folder
- The `ingredients` FK originally lacked `ON DELETE CASCADE` — fixed via `server/db/migrate.js`
- Google OAuth `callbackURL` is hardcoded to `http://localhost:3000/api/auth/google/callback`
- AI dietary tag auto-generation (Claude API) is planned but deferred — no API key available yet
