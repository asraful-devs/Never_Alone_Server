import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { EventController } from "./event.controller";
import { EventValidation } from "./event.validtion";

const router = express.Router();

router.post(
  "/create-event",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = EventValidation.createEventZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return EventController.CreateEvent(req, res, next);
  },
);

router.get("/get-all-events", EventController.GetAllEvents);

router.get("/get-single-event/:id", EventController.GetSingleEvent);

router.patch(
  "/update-event/:id",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = EventValidation.updateEventZodSchema.parse(
        JSON.parse(req.body.data),
      );
    }
    return EventController.UpdateEvent(req, res, next);
  },
);

router.delete("/delete-event/:id", EventController.DeleteEvent);

export const eventRoutes = router;
