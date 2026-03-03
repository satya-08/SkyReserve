# SkyReserve API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### 1. Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Satya Kumar",
    "email": "satya@example.com",
    "password": "password123"
  }
  ```

### 2. Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "satya@example.com",
    "password": "password123"
  }
  ```

---

## Flights

### 1. Search Flights
- **URL**: `/flights`
- **Method**: `GET`
- **Query Params**: `from` (string), `to` (string), `date` (YYYY-MM-DD)

### 2. Add Flight (Admin)
- **URL**: `/flights`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "flightNumber": "SR105",
    "airline": "SkyReserve",
    "from": "Hyderabad",
    "to": "Delhi",
    "departureTime": "2026-04-10T08:00:00Z",
    "arrivalTime": "2026-04-10T10:30:00Z",
    "totalSeats": 120,
    "price": 4500
  }
  ```

### 3. Delete Flight (Admin)
- **URL**: `/flights/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`

---

## Bookings

### 1. Create Booking
- **URL**: `/bookings`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "flightId": "60d5ecb8...",
    "seatNumber": "12A"
  }
  ```

### 2. Get User Bookings
- **URL**: `/bookings`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`

### 3. Cancel Booking
- **URL**: `/bookings/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`

### 4. Get All Bookings (Admin)
- **URL**: `/bookings/all`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
