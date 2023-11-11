import express from "express";
import {
  getvehiclelist,
  bookVehicle,
  getvehiclessubcategory,
  getcategory,
  login,
} from "../controllers/vehicleController.js";

import authenticateToken from "../middleware/auth.js";
const router = express.Router();

//login route to generate jwt
router.post("/login", login);

// ==================routes for vehicles================
//get category of vehilcles
router.get("/vehiclescategory", authenticateToken, getcategory);

//get subcategory of vehicles by no of wheels
router.get(
  "/getsubcategoryofvehicles/:numberofwheels",
  authenticateToken,
  getvehiclessubcategory
);

//get list of vehiicles by id
router.get("/getvehiclelist/:id", authenticateToken, getvehiclelist);

//book vehicles by vehicles id and date

router.post("/bookVehicle", authenticateToken, bookVehicle);

export default router;
