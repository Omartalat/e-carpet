# e-Carpet

## Overview

e-Carpet is a web application designed to sell carpets online. This project serves as a portfolio project for the ALX School graduation, showcasing skills in full-stack web development using modern technologies. The application features a user-friendly interface, secure payment processing, and robust backend functionality.

---

## Features

### **User-Facing Features**
- Browse a collection of carpets with detailed descriptions and prices.
- Add items to a shopping cart.
- Checkout securely using Stripe for payment processing.
- User authentication for account management and order history.

### **Admin Features**
- Manage product inventory (add, update, and delete carpets).
- View and manage customer orders.

---

## Technologies Used

### **Frontend**
- **EJS (Embedded JavaScript):** Dynamic HTML templating.
- **HTML5, CSS3, and JavaScript:** For building a responsive and interactive UI.

### **Backend**
- **Express.js:** Handles routing, middleware, and business logic.
- **Stripe:** Secure payment gateway integration.

### **Database**
- **MongoDB:** NoSQL database for storing user, product, and order data.

### **Other Tools**
- **bcrypt:** For password hashing.
- **dotenv:** For managing environment variables.
- **Mongoose:** ODM for MongoDB.
- **Nodemon:** For development server monitoring.

---

## Project Structure

```
project-root/
├── public/               # Static assets (CSS, JS, images)
├── views/                # EJS templates
├── routes/               # Application routes
├── models/               # Mongoose schemas
├── controllers/          # Application logic
├── middleware/           # Custom middleware functions
├── validators/           # For validation
├── .env                  # Environment variables
├── app.js                # Main application file
└── package.json          # Project dependencies
```

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Omartalat/e-carpet.git
   cd e-carpet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root with the following variables:
     ```env
     PORT=3000
     MONGO_URI=your-mongodb-connection-string
     STRIPE_SECRET_KEY=your-stripe-secret-key
     STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
     SESSION_SECRET=your-session-secret
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

---

## Usage

### **For Users:**
1. Sign up or log in to your account.
2. Browse available carpets and add them to your cart.
3. Proceed to checkout and pay securely using Stripe.
4. View your order history in your account dashboard.

### **For Admins:**
1. Log in with admin credentials.
2. Manage products (add, edit, or delete carpets).
3. View and manage customer orders.

---

## Roadmap

- Add support for product reviews and ratings.
- Implement advanced filtering and search functionality.
- Enable multi-language support for broader accessibility.
- Integrate analytics for admin insights into sales and user behavior.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments
- **ALX School:** For providing the platform and resources to build this project.
- **Open-source libraries and tools:** For making development easier and faster.

---

## Contact
For any inquiries or feedback, feel free to reach out:
- **Author:** Omar Talat Mohamed
- **Email:** omartalat@example.com
- **LinkedIn:** [LinkedIn Profile](https://linkedin.com/in/dr-omartalat)
- **GitHub Account:**![GitHub Profile](https://github.com/Omartalat/)
- **Repository:** [GitHub - Omartalat/e-carpet](https://github.com/Omartalat/e-carpet)

