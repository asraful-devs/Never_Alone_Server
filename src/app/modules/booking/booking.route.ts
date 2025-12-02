import experss from 'express';
import { BookingController } from './booking.controller';

const router = experss.Router();

router.post('/create-booking', BookingController.CreateBooking);

export const BookingRoute = router;
