const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/hallBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const roomSchema = new mongoose.Schema({
  roomName: String,
  numberOfSeats: Number,
  amenities: [String],
  pricePerHour: Number
});

const bookingSchema = new mongoose.Schema({
  customerName: String,
  date: Date,
  startTime: Date,
  endTime: Date,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }
});

const Room = mongoose.model('Room', roomSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// API for creating a room
app.post('/rooms', async (req, res) => {
  const room = new Room(req.body);
  await room.save();
  res.status(201).send(room);
});

// API for booking a room
app.post('/bookings', async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.status(201).send(booking);
});

// API for listing all rooms with booked data
app.get('/rooms', async (req, res) => {
  const rooms = await Room.find().populate('bookings');
  res.send(rooms);
});

// API for listing all customers with booked data
app.get('/bookings', async (req, res) => {
  const bookings = await Booking.find().populate('room');
  res.send(bookings);
});

// API for listing how many times a customer has booked the room
app.get('/customers/:customerName/bookings', async (req, res) => {
  const customerName = req.params.customerName;
  const bookings = await Booking.find({ customerName: customerName });
  res.send(bookings);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));