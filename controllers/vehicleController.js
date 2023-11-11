import connect from "../config/connection.js";
import jwt from "jsonwebtoken";

// Login and generate JWT
export const login = async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "First name and second name are required." });
  }

  const payload = {
    name: `${firstName} ${lastName}`,
  };

  const expiresIn = "15m"; // Set the expiration time to 5 minutes
  let secretKey = process.env.JWT_SECRET;

  // Generate the JWT with the updated expiration time
  const token = jwt.sign(payload, secretKey, { expiresIn });
  res.status(200).json({ token });
};

// Get vehicle categories
export const getcategory = async (req, res) => {
  try {
    const connection = connect();
    const [results] = await connection.query(
      "SELECT DISTINCT wheel_count AS number_of_wheels FROM vehicle_type"
    );

    connection.end(); // Close the connection after use
    if (results.length === 0) {
      return res.status(404).json({
        error: "No categories found for the specified number of wheels.",
      });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get vehicles subcategories by number category
export const getvehiclessubcategory = async (req, res) => {
  const numberofwheels = req.params.numberofwheels;

  if (!numberofwheels) {
    return res
      .status(400)
      .json({ error: "Number of wheels parameter is required." });
  }

  if (isNaN(numberofwheels)) {
    return res
      .status(400)
      .json({ error: "Number of wheels must be a valid number." });
  }

  try {
    const connection = connect();
    const [results] = await connection.query(
      `SELECT * FROM vehicle_type WHERE wheel_count = ?`,
      [numberofwheels]
    );

    connection.end(); // Close the connection after use
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No Vehicle found for the specified category." });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting subcategories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get vehicle list
export const getvehiclelist = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Provide vehicle sub-category id" });
  }
  try {
    const connection = connect();
    const [results] = await connection.query(
      `SELECT * FROM vehicles WHERE type_id = ?`,
      [id]
    );

    connection.end();
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No Vehicle found for the specified category." });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting subcategories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Book a vehicle with date
export const bookVehicle = async (req, res) => {
  const { vehicleId, startDate, endDate } = req.body;
  let user = req.user;

  const firstName = user.name.split(" ")[0];
  const lastName = user.name.split(" ")[1];

  // Validate that startDate is before endDate

  if (
    isNaN(new Date(startDate).getTime()) ||
    isNaN(new Date(endDate).getTime())
  ) {
    return res.status(400).json({ error: "Invalid date " });
  }

  if (new Date(startDate) >= new Date(endDate)) {
    return res
      .status(400)
      .json({ error: "Start date must be before end date" });
  }

  if (new Date(startDate) <= new Date()) {
    return res.status(400).json({ error: "Start date must be in the future" });
  }

  try {
    const connection = connect();
    const createBookingQuery =
      "INSERT INTO bookings (user_first_name, user_last_name, vehicle_id, booking_date, end_date) VALUES (?, ?, ?, ?, ?)";
    const checkAvailabilityQuery =
      "SELECT * FROM bookings WHERE vehicle_id = ? AND ((booking_date <= ? AND end_date >= ?) OR (booking_date <= ? AND end_date >= ?))";

    // Check if the selected vehicle is available
    const [rows] = await connection.query(checkAvailabilityQuery, [
      vehicleId,
      startDate,
      endDate,
      startDate,
      endDate,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({
        error: "Selected vehicle is already booked for the specified dates",
      });
    }

    // Create a new booking
    await connection.query(createBookingQuery, [
      firstName,
      lastName,
      vehicleId,
      startDate,
      endDate,
    ]);

    connection.end();
    return res.status(200).json({ message: "Booking created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
