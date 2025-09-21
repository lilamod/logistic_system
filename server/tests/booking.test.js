const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); 
const Booking = require("../models/booking.model");
const Vehicle = require("../models/vehicle.model");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/systemCheck", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Booking.deleteMany({});
  await Vehicle.deleteMany({});
});

describe("POST /api/vehicle", () => {
  it("should create a new vehicle", async () => {
    const vehicleData = {
      vehicleName: "Test Vehicle",
      capacity: 4,
      tyres: 4,
      isDeleted: false,
    };

    const res = await request(app)
      .post("/api/vehicles")
      .send(vehicleData)
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.vehicleName).toBe(vehicleData.vehicleName);
  });
});

describe("GET /api/vehicle/available", () => {
  it("should return available vehicles excluding those with conflicting bookings", async () => {
    const vehicle1 = await Vehicle.create({
      vehicleName: "Vehicle 1",
      capacity: 4,
      tyres: 4,
      isDeleted: false,
    });
    const vehicle2 = await Vehicle.create({
      vehicleName: "Vehicle 2",
      capacity: 6,
      tyres: 6,
      isDeleted: false,
    });

    const startTime = new Date("2024-07-01T10:00:00Z");
    const bookingEndTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

    await Booking.create({
      vehicle: vehicle1._id,
      fromPincode: "100001",
      toPincode: "100005",
      startTime,
      bookingEndTime,
      customerId: "cust1",
      estimatedRideDurationHours: 2,
      isDeleted: false,
    });

    const searchPayload = {
      capacityRequired: 4,
      fromPincode: "100001",
      toPincode: "100005",
      startTime: "2024-07-01T11:00:00Z", 
    };

    const res = await request(app)
      .get("/api/vehicle/available")
      .query(searchPayload)
      .expect(200);

    const availableVehicleIds = res.body.list.map((v) => v._id.toString());
    expect(availableVehicleIds).not.toContain(vehicle1._id.toString());
    expect(availableVehicleIds).toContain(vehicle2._id.toString());
  });
});

describe("POST /api/booking", () => {
  it("should create a booking successfully when no conflict", async () => {
    const vehicle = await Vehicle.create({
      vehicleName: "Vehicle A",
      capacity: 4,
      tyres: 4,
      isDeleted: false,
    });

    const bookingPayload = {
      vehicle: vehicle._id.toString(),
      fromPincode: "100001",
      toPincode: "100010",
      startTime: "2024-07-01T08:00:00Z",
      customerId: "customer123",
    };

    const res = await request(app)
      .post("/api/booking")
      .send(bookingPayload)
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.vehicle).toBe(vehicle._id.toString());
    expect(res.body.fromPincode).toBe(bookingPayload.fromPincode);
  });

  it("should return 409 conflict if vehicle is already booked for overlapping time", async () => {
    const vehicle = await Vehicle.create({
      vehicleName: "Vehicle B",
      capacity: 4,
      tyres: 4,
      isDeleted: false,
    });

    const existingStart = new Date("2024-07-01T10:00:00Z");
    const existingEnd = new Date(existingStart.getTime() + 2 * 60 * 60 * 1000);

    await Booking.create({
      vehicle: vehicle._id,
      fromPincode: "100001",
      toPincode: "100005",
      startTime: existingStart,
      bookingEndTime: existingEnd,
      customerId: "cust1",
      estimatedRideDurationHours: 2,
      isDeleted: false,
    });

    const bookingPayload = {
      vehicle: vehicle._id.toString(),
      fromPincode: "100002",
      toPincode: "100006",
      startTime: "2024-07-01T11:00:00Z",
      customerId: "customer456",
    };

    const res = await request(app)
      .post("/api/booking")
      .send(bookingPayload)
      .expect(409);

    expect(res.body.message).toBe(
      "Vehicle is already booked for the specified time slot"
    );
  });
});