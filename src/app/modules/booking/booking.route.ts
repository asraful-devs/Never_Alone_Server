import experss from "express";
import { BookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = experss.Router();

router.post(
  "/create-booking",
  auth(Role.USER),
  BookingController.CreateBooking,
);

router.delete(
  "/delete-booking/:id",
  auth(Role.USER),
  BookingController.DeleteBooking,
);

router.get("/my-bookings", auth(Role.USER), BookingController.GetUserBookings);

export const BookingRoute = router;
