import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  validateRequest(AdminValidation.createAdminValidationSchema),
  AdminController.CreateAdmin,
);

router.get("/get-all-admin", auth(Role.ADMIN), AdminController.GetAllAdmin);

router.get("/get-single-admin/:id", AdminController.GetSingleAdmin);

router.patch(
  "/update-admin/:id",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = AdminValidation.updateAdminValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return AdminController.UpdateAdmin(req, res, next);
  },
);

router.delete("/soft-delete-admin/:id", AdminController.DeleteAdmin);

export const adminRoutes = router;
