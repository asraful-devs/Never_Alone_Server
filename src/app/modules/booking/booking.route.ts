import experss from 'express';
import { BookingController } from './booking.controller';

const router = experss.Router();

router.post('/create-booking', BookingController.CreateBooking);

router.delete('/delete-booking/:id', BookingController.DeleteBooking);

export const BookingRoute = router;
