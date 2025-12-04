# Never Alone - Event Management Server

A modern, full-featured event management backend built with Node.js, Express, and Prisma.

## 🚀 Features

### Authentication

-   User registration & login
-   JWT token-based authentication
-   Password reset with email verification
-   Role-based access control (Admin, Host, User)

### Event Management

-   Create, read, update, delete events
-   Event booking system
-   Seat availability tracking
-   Multi-user event participation
-   Event hosting by verified hosts

### Booking & Payment

-   Stripe payment integration
-   Booking confirmation emails
-   Payment tracking & status management
-   Auto-cancel unpaid bookings (30-min timeout)
-   Transaction history

### Email System

-   Professional HTML email templates
-   Password reset emails
-   Payment confirmation emails
-   Email-client optimized templates
-   Responsive design for all devices

### User Roles

-   **Admin**: Manage platform & users
-   **Host**: Create & manage events
-   **User**: Browse & book events

## 📁 Folder Structure

```
never_alone_server/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/              # Authentication
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.route.ts
│   │   │   ├── booking/           # Booking management
│   │   │   │   ├── booking.service.ts
│   │   │   │   ├── booking.controller.ts
│   │   │   │   └── booking.route.ts
│   │   │   ├── event/             # Event management
│   │   │   │   ├── event.service.ts
│   │   │   │   ├── event.controller.ts
│   │   │   │   └── event.route.ts
│   │   │   ├── user/              # User management
│   │   │   ├── admin/             # Admin operations
│   │   │   └── host/              # Host operations
│   │   ├── config/                # Configuration
│   │   │   ├── config.ts
│   │   │   └── db.ts
│   │   ├── error/                 # Error handling
│   │   ├── helpers/               # Utility helpers
│   │   │   └── stripe.ts
│   │   └── utils/                 # Utilities
│   │       └── emailSender.ts
│   ├── templates/                 # Email templates
│   │   └── email/
│   │       ├── resetPassword.ts
│   │       ├── paymentConfirmation.ts
│   │       └── index.ts
│   └── middleware/                # Express middleware
├── prisma/
│   ├── schema/
│   │   ├── user.prisma
│   │   ├── event.prisma
│   │   ├── booking.prisma
│   │   └── payment.prisma
│   └── migrations/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Setup

### Prerequisites

-   Node.js 16+
-   PostgreSQL
-   Stripe account
-   Gmail account (for emails)

## 📚 API Endpoints

### Auth

-   `POST /api/auth/register` - Register user
-   `POST /api/auth/login` - Login
-   `POST /api/auth/refresh` - Refresh token
-   `POST /api/auth/forgot-password` - Request password reset
-   `POST /api/auth/reset-password` - Reset password
-   `GET /api/auth/me` - Get current user

### Events

-   `GET /api/events` - List all events
-   `POST /api/events` - Create event
-   `GET /api/events/:id` - Get event details
-   `PUT /api/events/:id` - Update event
-   `DELETE /api/events/:id` - Delete event

### Bookings

-   `POST /api/bookings` - Create booking
-   `GET /api/bookings` - List bookings
-   `DELETE /api/bookings/:id` - Cancel booking

### Payments

-   `GET /api/payments` - Get payment history
-   `POST /api/payments/webhook` - Stripe webhook

## 📧 Email Templates

Organized templates with inline styles for compatibility:

-   **Reset Password** - 10-min expiry, security tips
-   **Payment Confirmation** - Booking details, payment link
-   **Welcome** - New user onboarding (upcoming)

Templates located in `src/templates/email/`

## 🔐 Security

-   Password hashing with bcrypt
-   JWT token authentication
-   Email verification
-   Payment gateway integration
-   Environment variable protection
-   Request validation
-   CORS enabled

## 🗄️ Database Schema

## 📦 Technologies

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: PostgreSQL + Prisma ORM
-   **Authentication**: JWT
-   **Payment**: Stripe
-   **Email**: Nodemailer
-   **Validation**: Zod

## 📝 License

MIT License - See LICENSE file

## 👥 Support

For issues or questions, contact: work.mdasraful56@gmail.com
