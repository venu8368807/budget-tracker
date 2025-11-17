# Budget-Aware Expense Tracker

A full-stack web application for tracking expenses and managing monthly budgets per category.

## Features

✅ **User Authentication** - Sign up and login with email/password  
✅ **Category Management** - Create, edit, and delete expense categories with custom colors  
✅ **Budget Planning** - Set monthly budgets per category  
✅ **Expense Tracking** - Add expenses and get instant budget status (within/over budget)  
✅ **Monthly Reports** - View detailed spending summaries with spent, budget, and remaining amounts  
✅ **Dashboard** - Visual progress bars showing spending vs. budget per category  

## Project Structure

```
budget-tracker/
├── server/                      # Node.js + Express backend
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Category.js         # Category schema
│   │   ├── Budget.js           # Monthly budget schema
│   │   └── Expense.js          # Expense schema
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── categories.js       # Category CRUD endpoints
│   │   ├── budgets.js          # Budget CRUD endpoints
│   │   └── expenses.js         # Expense & reports endpoints
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── server.js               # Main server file
│   ├── package.json
│   └── .env
│
└── client/                      # React frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Auth.jsx        # Login & signup page
    │   │   ├── Dashboard.jsx   # Main dashboard with categories
    │   │   ├── Categories.jsx  # Category management
    │   │   ├── Budgets.jsx     # Budget management
    │   │   └── Reports.jsx     # Monthly spending report
    │   ├── components/
    │   │   ├── Navbar.jsx      # Navigation bar
    │   │   └── ExpenseForm.jsx # Expense modal form
    │   ├── api.js              # API helper functions
    │   ├── App.jsx             # Main app component
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── .env.local
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp ../.env.example .env
   ```

4. **Update `.env` with your values:**
   ```env
   MONGO_URI=mongodb://localhost:27017/budget-tracker
   JWT_SECRET=your_secure_secret_key
   PORT=5000
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173` (or your configured Vite port)

5. **Build for production:**
   ```bash
   npm run build
   ```

## API Endpoints

All endpoints (except `/auth/signup` and `/auth/login`) require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Create new user account |
| POST | `/auth/login` | Login and get JWT token |

**Signup/Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | Get all categories for logged-in user |
| POST | `/categories` | Create new category |
| PUT | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

**Create Category Request:**
```json
{
  "name": "Food",
  "color": "#FF6B6B",
  "limit": 5000
}
```

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budgets?month=3&year=2025` | Get budgets for specific month |
| POST | `/budgets` | Create budget |
| PUT | `/budgets/:id` | Update budget |
| DELETE | `/budgets/:id` | Delete budget |

**Create Budget Request:**
```json
{
  "categoryId": "507f1f77bcf86cd799439011",
  "month": 3,
  "year": 2025,
  "amount": 5000
}
```

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/expenses` | Add expense (returns budget status) |
| GET | `/expenses?month=2025-03` | Get expenses for specific month |
| GET | `/expenses/report/2025-03` | Get monthly report (spent/budget/remaining) |

**Add Expense Request:**
```json
{
  "categoryId": "507f1f77bcf86cd799439011",
  "amount": 450,
  "date": "2025-03-15"
}
```

**Add Expense Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "categoryId": "507f1f77bcf86cd799439011",
  "amount": 450,
  "totalSpent": 1250,
  "budgetAmount": 5000,
  "status": "within_budget",
  "date": "2025-03-15T00:00:00.000Z",
  "month": 3,
  "year": 2025
}
```

**Monthly Report Response:**
```json
[
  {
    "categoryId": "507f1f77bcf86cd799439011",
    "categoryName": "Food",
    "categoryColor": "#FF6B6B",
    "spent": 1250,
    "budget": 5000,
    "remaining": 3750
  },
  {
    "categoryId": "507f1f77bcf86cd799439012",
    "categoryName": "Transport",
    "categoryColor": "#4ECDC4",
    "spent": 2100,
    "budget": 2000,
    "remaining": -100
  }
]
```

## Usage Guide

### 1. Sign Up / Login
- Visit the app and sign up with email and password
- On next login, use your credentials to access the dashboard

### 2. Create Categories
- Go to **Categories** page
- Enter category name, color (hex code), and monthly limit
- Click "Add Category"
- You can edit or delete categories anytime

### 3. Set Monthly Budgets
- Go to **Budgets** page
- Select the month you want to plan for
- Enter budget amounts for each category
- Click "Save" to set or update budget

### 4. Add Expenses
- Click the **"+"** button on Dashboard
- Select category, enter amount, pick date
- Click "Save"
- App shows if you're within or over budget

### 5. View Reports
- Go to **Reports** page
- Select a month
- See table with spent, budget, and remaining per category
- Red highlighting shows categories over budget

### 6. Monitor Dashboard
- Dashboard shows all categories with progress bars
- Green = within budget, Red badge = over budget
- Use month selector to view different months

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin requests

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

## Environment Variables

### Server `.env`
```env
MONGO_URI=mongodb://localhost:27017/budget-tracker
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

### Client `.env.local`
```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` in both `server` and `client` directories

### CORS errors
- Ensure `VITE_API_URL` in `.env.local` matches server port (default 5000)

### MongoDB connection errors
- Check MongoDB is running: `mongod`
- Verify `MONGO_URI` is correct in `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP

### Expenses not showing budget status
- Ensure budget is set for category/month in Budgets page
- Check month is correct (defaults to current month)

## Future Enhancements

- [ ] Toast notifications for better UX
- [ ] Recurring expenses
- [ ] Export reports to CSV/PDF
- [ ] Budget alerts and notifications
- [ ] Multi-currency support
- [ ] Budget analytics and trends
- [ ] Mobile app version

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, check the code comments or create an issue in the repository.
