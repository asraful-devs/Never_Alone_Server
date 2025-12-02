import z from "zod";

const createHostZodSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

const updateHostZodSchema = z.object({
  name: z.string().optional(),
  profilePhoto: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

export const HostValidation = {
  createHostZodSchema,
  updateHostZodSchema,
};
