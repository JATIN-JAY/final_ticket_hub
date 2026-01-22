# TicketHub 🎫

A full-stack event booking platform that enables users to browse events, select seats in real-time, and manage bookings securely with a seamless user experience.

## 🌟 Features

### For Users
- **Event Browsing**: Discover and explore upcoming events with detailed information
- **Real-time Seat Selection**: Interactive seat selection with live availability updates
- **Secure Bookings**: Transaction-based booking system preventing double bookings and race conditions
- **Booking Management**: View and manage your event bookings from your dashboard
- **JWT Authentication**: Secure user authentication and session management

### For Administrators
- **Event Management**: Create, update, and delete events through an intuitive admin dashboard
- **Booking Overview**: Monitor all bookings and manage event capacity
- **Pricing Control**: Set and adjust event pricing with INR currency support
- **Role-based Access**: Secure admin panel with role-based access control

## 🚀 Tech Stack

### Frontend
- **React.js** - Dynamic UI components and state management
- **Tailwind CSS** - Modern, responsive styling
- **Vercel** - CI/CD deployment with high availability

### Backend
- **Node.js** - Runtime environment
- **Express.js** - RESTful API framework
- **MongoDB** - NoSQL database for flexible data storage
- **JWT** - Secure authentication tokens

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/JATIN-JAY/tickethub.git
cd tickethub

# Install backend dependencies
cd backend
npm install

# Create .env file
touch .env

# Add environment variables
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# PORT=5000

# Start the backend server
npm start
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend
npm install

# Create .env file
touch .env

# Add environment variables
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
tickethub/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── public/
└── README.md
```

## 🔐 Authentication

The platform uses JWT-based authentication with the following flow:
1. User registers/logs in with credentials
2. Server validates and generates JWT token
3. Token stored in client and sent with subsequent requests
4. Role-based middleware validates user permissions

## 💳 Booking Flow

1. User selects an event
2. Interactive seat map displays availability
3. User selects desired seats
4. Transaction-based booking prevents race conditions
5. Confirmation sent upon successful booking

## 🌐 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
cd frontend
vercel --prod
```

### Backend
Deploy to your preferred platform (Heroku, Railway, DigitalOcean, etc.)

## 🔑 Key Features Explained

### Transaction-based Booking
Implements MongoDB transactions to ensure atomicity in booking operations, preventing:
- Double bookings
- Race conditions during simultaneous seat selection
- Data inconsistency

### Role-based Access Control
- **User Role**: Browse events, book tickets, manage personal bookings
- **Admin Role**: Full access to event and booking management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

Jatin Jay Singh
- GitHub: [@JATIN-JAY](https://github.com/JATIN-JAY)
- LinkedIn: [Jatin Jay Singh](https://www.linkedin.com/in/jatin-jay-singh-788088349/)

## 🙏 Acknowledgments

- Event booking inspiration from platforms like BookMyShow
- React.js and MongoDB communities for excellent documentation
- Contributors and testers

---

⭐ Star this repo if you find it helpful!
