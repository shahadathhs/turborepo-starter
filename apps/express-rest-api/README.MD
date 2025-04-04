# Bari Sathi Server

This repository contains the backend server for the Bari Sathi project. It serves as the main API backend, handling authentication, listings, and bookings. The server is built using Node.js and Express and supports JWT-based authentication, user role management, and more.

## Live Demo

- **Live URL:** [https://barisathi-server.vercel.app/api](https://barisathi-server.vercel.app/api)

## Repository Links

- **Server Repository:** [github.com/shahadathhs/barisathi-server](https://github.com/shahadathhs/barisathi-server)
- **Client Repository:** [github.com/shahadathhs/barisathi](https://github.com/shahadathhs/barisathi)

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)

## Features

- **Authentication:** User registration, login, profile updates, password changes, and role management.
- **Listings Management:** CRUD operations for listings (create, read, update, delete).
- **Bookings Management:** Create bookings, fetch booking details, update booking status, and delete bookings.
- **Role-Based Access Control:** Different endpoints accessible based on user roles (ADMIN, LANDLORD, TENANT).
- **Middleware Integration:** Includes API info logging, error handling, and request validation.

## Getting Started

### Prerequisites

- **Node.js:** Ensure you have Node.js installed (version 14 or above is recommended).
- **npm:** Comes bundled with Node.js.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/shahadathhs/barisathi-server.git
   cd barisathi-server
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory based on the provided example (`.env.example`). Here is a sample configuration:

```dotenv
# General
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL=test

# JWT
JWT_SECRET=b5ef9a583e4408e50fbc548b4e45999adc3642c330677ba29483ac47cc9100a2
JWT_EXPIRES_IN=1d
```

Make sure to replace the values with your actual configuration as needed.

## Running Locally

To run the server locally, follow these steps:

1. **Ensure your `.env` file is properly configured.**

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**

   ```bash
   npm run start:dev
   ```

   This command will start the server on the port specified in your `.env` file (default is 5000). The server supports hot reloading for a smoother development experience.

4. **Access the Server:**

   - Open your browser and navigate to `http://localhost:8080/` to see the welcome message.
   - Access the root API route at `http://localhost:8080/api` for more details.

## API Endpoints

The server exposes several endpoints grouped into modules. Below is an overview of the available endpoints:

### Authentication Routes (`/api/auth`)

- **Register a new user:**  
  `POST /api/auth/register`  
  _Validates request with registration schema._

- **Login an existing user:**  
  `POST /api/auth/login`

- **Update user profile:**  
  `PATCH /api/auth/update-profile`  
  _Accessible to authenticated users (LANDLORD, TENANT, ADMIN)._

- **Update user password:**  
  `PATCH /api/auth/update-password`  
  _Accessible to authenticated users._

- **Update user delete status (soft delete):**  
  `POST /api/auth/:id/delete`  
  _Accessible to LANDLORD and TENANT._

- **Retrieve all users:**  
  `GET /api/auth/getAll`  
  _Admin only._

- **Update user role:**  
  `PATCH /api/auth/:id/role`  
  _Admin only._

- **Update user active status:**  
  `PATCH /api/auth/:id/active`  
  _Admin only._

### Listing Routes (`/api/listings`)

- **Create a listing:**  
  `POST /api/listings/`  
  _Accessible to LANDLORD only._

- **Get all listings (public):**  
  `GET /api/listings/`

- **Get all listings for a landlord:**  
  `GET /api/listings/landlord`  
  _Accessible to LANDLORD only._

- **Get listing details:**  
  `GET /api/listings/:id`  
  _Public access._

- **Update a listing:**  
  `PATCH /api/listings/:id`  
  _Accessible to LANDLORD and ADMIN._

- **Delete a listing:**  
  `DELETE /api/listings/:id`  
  _Accessible to LANDLORD and ADMIN._

### Booking Routes (`/api/bookings`)

- **Create a booking:**  
  `POST /api/bookings/`  
  _Accessible to TENANT only._

- **Get all bookings:**  
  `GET /api/bookings/`  
  _Admin only._

- **Get all bookings for a tenant:**  
  `GET /api/bookings/tenant`  
  _Accessible to TENANT only._

- **Get all bookings for a landlord:**  
  `GET /api/bookings/landlord`  
  _Accessible to LANDLORD only._

- **Get booking details:**  
  `GET /api/bookings/:id`  
  _Accessible to ADMIN, TENANT, and LANDLORD (if associated with the booking)._

- **Update booking status:**  
  `PATCH /api/bookings/:id/status`  
  _Accessible to LANDLORD and TENANT._

- **Delete a booking:**  
  `DELETE /api/bookings/:id`  
  _Admin only._
