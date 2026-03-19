# Victorian Novels

A web application for exploring and reviewing classic literature from the Victorian era (1837–1901). Built with Node.js, Express, MongoDB, and EJS.

---

## Features

- Browse a curated collection of 15 Victorian novels
- Register and log in with a secure account
- Leave reviews and star ratings on novels
- Edit or delete your own reviews
- Admin controls for managing the novel collection

---

## Tech Stack

- **Backend** — Node.js, Express
- **Database** — MongoDB Atlas + Mongoose
- **Authentication** — Passport.js with LocalStrategy, bcryptjs
- **Sessions** — express-session, connect-flash
- **Templating** — EJS
- **Styling** — Bootstrap 5, custom CSS (Victorian theme)

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org) (v18 or higher)
- [npm](https://www.npmjs.com) (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier is fine)

---

## Installation

**1. Clone the repository:**
```bash
git clone https://github.com/yourusername/victorian-novels.git
cd victorian-novels
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create a `.env` file at the root level:**
```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/victorian-novels
SESSION_SECRET=your_random_secret_string_here
ADMIN_USERNAME=your_admin_username
```

> Never commit your `.env` file — it is already listed in `.gitignore`

**4. Seed the database with Victorian novels:**
```bash
node seeds.js
```

This populates your MongoDB Atlas database with 15 curated Victorian novels. You can re-run this at any time to reset the novel collection — note that this will wipe existing novels.

**5. Start the development server:**
```bash
npm start
```

The app will be running at `http://localhost:3000`

---

## Project Structure

```
victorian-novels/
├── middleware/
│   ├── passport.js       # Passport LocalStrategy configuration
│   ├── isLoggedIn.js     # Auth guard for protected routes
│   └── isAdmin.js        # Admin guard for novel management
├── models/
│   ├── user.js           # User schema
│   ├── novel.js          # Novel schema
│   └── review.js         # Review schema
├── public/
│   └── css/
│       └── style.css     # Global Victorian-themed stylesheet
├── routes/
│   ├── auth.js           # Register, login, logout
│   ├── novels.js         # Novel CRUD routes
│   └── reviews.js        # Review CRUD routes
├── views/
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── novels/
│   │   ├── index.ejs     # All novels
│   │   ├── show.ejs      # Single novel + reviews
│   │   ├── new.ejs       # Add novel form (admin only)
│   │   └── edit.ejs      # Edit novel form (admin only)
│   ├── reviews/
│   │   └── edit.ejs      # Edit review form
│   └── home.ejs          # Landing page
├── app.js                # Entry point
├── seeds.js              # Database seed script
├── novels.json           # Curated Victorian novel data
├── .env                  # Environment variables (not committed)
├── .gitignore
└── package.json
```

---

## Routes

### Auth
| Method | Route | Description |
|---|---|---|
| GET | `/register` | Show register form |
| POST | `/register` | Create new user |
| GET | `/login` | Show login form |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Log out current user |

### Novels
| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/novels` | All novels | Public |
| GET | `/novels/:id` | Single novel + reviews | Public |
| GET | `/novels/new` | Add novel form | Admin only |
| POST | `/novels` | Create novel | Admin only |
| GET | `/novels/:id/edit` | Edit novel form | Admin only |
| PUT | `/novels/:id` | Update novel | Admin only |
| DELETE | `/novels/:id` | Delete novel + reviews | Admin only |

### Reviews
| Method | Route | Description | Access |
|---|---|---|---|
| POST | `/novels/:id/reviews` | Create review | Logged in |
| GET | `/novels/:id/reviews/:reviewId/edit` | Edit review form | Review author only |
| PUT | `/novels/:id/reviews/:reviewId` | Update review | Review author only |
| DELETE | `/novels/:id/reviews/:reviewId` | Delete review | Review author only |

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | A long random string for signing session cookies |
| `ADMIN_USERNAME` | The username that has admin privileges |

---

## Admin Access

The admin account can add, edit, and delete novels. To become admin, register with the username you set as `ADMIN_USERNAME` in your `.env` file. Admin controls will appear automatically in the navbar and on novel pages.

---

## Resetting the Database

To wipe and re-seed the novel collection:
```bash
node seeds.js
```

> This only deletes novels — user accounts and reviews are not affected unless you manually clear those collections in MongoDB Atlas.

---
