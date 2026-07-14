<div dir="rtl">

# 🚗 חנות רכבים חשמליים — Full-Stack MERN

אפליקציית **מכירת רכבים חשמלים** מבוססת MERN Stack, עם מערכת הרשמה והתחברות, ניהול קטלוג רכבים, וסל קניות. האפליקציה כוללת הרשאות מבוססות תפקידים (משתמש רגיל מול מנהל).

---

## 🧱 טכנולוגיות

### צד שרת (Server)
- **Node.js + Express 5** — שרת ה-API
- **MongoDB + Mongoose 8** — בסיס הנתונים
- **JWT (jsonwebtoken)** — אימות מבוסס טוקנים
- **bcrypt** — הצפנת סיסמאות
- **cors**, **dotenv** — הגדרות סביבה ואבטחה

### צד לקוח (Client)
- **React 19** — ספריית ה-UI
- **Redux Toolkit + RTK Query** — ניהול State ותקשורת עם ה-API
- **React Router 7** — ניתוב בצד הלקוח
- **PrimeReact + PrimeFlex + PrimeIcons** — רכיבי עיצוב וממשק
- **jwt-decode** — פענוח הטוקן בצד הלקוח (זיהוי תפקיד המשתמש)

---

## 📂 מבנה הפרויקט

```
node-react-project/
├── server/                     # צד שרת (Express API)
│   ├── config/
│   │   ├── corsOptions.js       # הגדרות CORS (origins מורשים)
│   │   └── dbConn.js            # חיבור ל-MongoDB
│   ├── controllers/
│   │   ├── authController.js     # הרשמה + התחברות
│   │   ├── carController.js      # CRUD לרכבים
│   │   └── cartController.js     # ניהול סל הקניות
│   ├── middleware/
│   │   └── verifyJWT.JS          # אימות טוקן JWT
│   ├── models/
│   │   ├── User.js              # מודל משתמש
│   │   ├── Car.js               # מודל רכב
│   │   └── Cart.js              # מודל סל קניות
│   ├── routs/
│   │   ├── authRouts.js
│   │   ├── carRouts.js
│   │   └── cartRouts.js
│   └── server.js               # נקודת הכניסה של השרת
│
└── client/                     # צד לקוח (React)
    ├── public/
    └── src/
        ├── app/
        │   ├── store.js         # הגדרת Redux Store
        │   └── apiSlice.js      # הגדרת RTK Query הבסיסית
        ├── components/
        │   ├── Layout.js        # פריסה כללית + Navbar
        │   └── Navbar.js        # תפריט ניווט
        └── features/
            ├── auth/            # הרשמה, התחברות, ניהול טוקן
            ├── cars/            # רשימת רכבים, הוספה, עריכה
            └── cart/            # סל הקניות
```

---

## 🗄️ מודל הנתונים

### User (משתמש)
| שדה | סוג | הערות |
|------|-----|-------|
| `username` | String | ייחודי, חובה |
| `password` | String | מוצפן (bcrypt), חובה |
| `name` | String | חובה |
| `email` | String | |
| `phone` | String | |
| `roles` | String | `User` / `Admin` (ברירת מחדל: `User`) |
| `active` | Boolean | ברירת מחדל: `true` |

### Car (רכב)
| שדה | סוג | הערות |
|------|-----|-------|
| `model` | String | ייחודי, חובה |
| `modelyear` | Date | חובה |
| `color` | String | `red`/`blue`/`gray`/`black`/`white` |
| `price` | Number | חובה |
| `capacity` | Number | קיבולת נוסעים |
| `topspeed` | Number | מהירות מרבית |
| `chargingtime` | Number | זמן טעינה |
| `img` | String | כתובת תמונה |

### Cart (סל קניות)
- `userId` — הפניה למשתמש
- `items[]` — מערך של `{ productId (הפניה לרכב), quantity }`

---

## 🔌 נקודות קצה (API)

בסיס: `http://localhost:1500`

### אימות — `/api/auth`
| Method | Endpoint | תיאור | דורש טוקן |
|--------|----------|-------|:---------:|
| `POST` | `/register` | הרשמת משתמש חדש | ❌ |
| `POST` | `/login` | התחברות והחזרת טוקן | ❌ |

### רכבים — `/api/cars`
| Method | Endpoint | תיאור | דורש טוקן |
|--------|----------|-------|:---------:|
| `GET` | `/get-cars` | כל הרכבים | ✅ |
| `POST` | `/add-car` | הוספת רכב | ✅ |
| `GET` | `/get-car/:id` | רכב לפי מזהה | ✅ |
| `PUT` | `/update-car` | עדכון רכב | ✅ |
| `DELETE` | `/delete-car/:id` | מחיקת רכב | ✅ |

### סל קניות — `/api/cart`
| Method | Endpoint | תיאור | דורש טוקן |
|--------|----------|-------|:---------:|
| `GET` | `/get-cart` | הסל של המשתמש הנוכחי | ✅ |
| `POST` | `/add` | הוספת מוצר לסל | ✅ |
| `GET` | `/:id` | מוצר בסל לפי מזהה | ✅ |
| `DELETE` | `/delete/:productId` | הסרה/הפחתת כמות של מוצר | ✅ |

> כל הראוטים של `cars` ו-`cart` מוגנים ע"י ה-middleware `verifyJWT` (יש לשלוח כותרת `Authorization: Bearer <token>`).

---

## 👥 הרשאות ותפקידים

- **משתמש רגיל (`User`)** — צופה ברכבים ומוסיף אותם לסל הקניות שלו.
- **מנהל (`Admin`)** — מוסיף, עורך ומוחק רכבים מהקטלוג.

התפקיד נשמר בטוקן ה-JWT, מפוענח בצד הלקוח (`useAuth`), וקובע אילו פעולות מוצגות ב-UI.

---

## ⚙️ התקנה והרצה

### דרישות מוקדמות
- Node.js (18+)
- מסד נתונים MongoDB (מקומי או Atlas)

### 1. הגדרת השרת

```bash
cd server
npm install
```

צרו קובץ `.env` בתיקיית `server/` עם המשתנים הבאים:

```env
DATABASE_URI=<כתובת החיבור ל-MongoDB>
ACCESS_TOKEN_SECRET=<מפתח סודי לחתימת הטוקן>
PORT=1500
```

הרצה:

```bash
npm run dev      # מצב פיתוח (nodemon)
# או
npm start        # מצב רגיל
```

השרת יעלה על `http://localhost:1500`.

### 2. הגדרת הלקוח

```bash
cd client
npm install
npm start
```

הלקוח יעלה על `http://localhost:3000`.

---

## 🔐 זרימת האימות

1. המשתמש נרשם (`/register`) — הסיסמה מוצפנת ונשמרת.
2. המשתמש מתחבר (`/login`) — השרת מאמת ומחזיר **JWT**.
3. הטוקן נשמר ב-`localStorage` וב-Redux (`authSlice`).
4. RTK Query מצרף אוטומטית את הטוקן לכותרת `Authorization` בכל בקשה (`apiSlice`).
5. ה-middleware `verifyJWT` מאמת את הטוקן בכל בקשה מוגנת.

---

## 📝 הערות ושיפורים אפשריים

- קובץ ה-middleware נקרא `verifyJWT.JS` (סיומת באותיות גדולות) — מומלץ לאחד ל-`verifyJWT.js` כדי למנוע בעיות בסביבות case-sensitive (Linux/Deploy).
- כרגע ההגבלה שרק מנהל מוסיף/מוחק רכבים נאכפת בצד הלקוח בלבד. מומלץ להוסיף בדיקת הרשאות גם בצד השרת.
- ניתן להוסיף רענון טוקן (Refresh Token) ותוקף פקיעה (`expiresIn`) לטוקן.

---

_פרויקט גמר — פיתוח Full-Stack._

</div>
