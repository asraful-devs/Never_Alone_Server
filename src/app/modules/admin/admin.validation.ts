import z from "zod";

const createAdminValidationSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

const updateAdminValidationSchema = z.object({
  contactNumber: z.string().optional(),
  profilePhoto: z.string().url("Invalid URL").optional(),
});

export const AdminValidation = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
