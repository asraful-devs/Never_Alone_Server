import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { HostController } from "./host.controller";
import { HostValidation } from "./host.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helpers/fileUploader";

const router = express.Router();

router.post(
  "/create-host",
  validateRequest(HostValidation.createHostZodSchema),
  HostController.CreateHost,
);

router.get("/get-all-host", auth(Role.ADMIN), HostController.GetAllHost);

router.get("/get-single-host/:id", HostController.GetSingleHost);

router.patch(
  "/update-host/:id",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = HostValidation.updateHostZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return HostController.UpdateHost(req, res, next);
  },
);

router.delete("/soft-delete-host/:id", HostController.DeleteHost);

export const hostRoutes = router;
