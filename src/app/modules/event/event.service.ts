import { Prisma } from "@prisma/client";
import { Request } from "express";
import prisma from "../../config/db";
import ApiError from "../../error/ApiError";
import { fileUploader } from "../../helpers/fileUploader";
import { IOptions, paginationHelper } from "../../helpers/paginationHelper";

const createEvent = async (req: Request) => {
  // Step 1: File upload handle করুন
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.eventImage = uploadResult?.secure_url;
  }

  const payload = req.body;

  // Step 2: Person থেকে Host data বের করুন
  const personWithHost = await prisma.person.findUnique({
    where: {
      id: payload.hostId, // এটা Person ID
    },
    include: {
      host: true, // Host relation include করুন
    },
  });

  // Step 3: Validations
  if (!personWithHost) {
    throw new ApiError(404, "Person not found");
  }

  if (personWithHost.role !== "HOST") {
    throw new ApiError(403, "Only hosts can create events");
  }

  if (!personWithHost.host) {
    throw new ApiError(404, "Host profile not found for this person");
  }

  if (personWithHost.host.isDeleted) {
    throw new ApiError(403, "Host account is deleted");
  }

  // Step 4: Category validation
  const categoryIsExisting = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!categoryIsExisting) {
    throw new ApiError(404, "Category not found");
  }

  // Step 5: Event create করুন (Host ID দিয়ে)
  const result = await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      startDateTime: new Date(payload.startDateTime),
      endDateTime: new Date(payload.endDateTime),
      fee: payload.fee,
      seats: payload.seats,
      location: payload.location,
      categoryId: payload.categoryId,
      hostId: personWithHost.host.id, // ✅ Host table এর ID
      eventImage: payload.eventImage,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      host: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          rating: true,
          isVerified: true,
        },
      },
    },
  });

  return result;
};

const getAllEvents = async (
  filters: {
    title?: string;
    location?: string;
    category?: string;
    searchTerm?: string;
  },
  options: IOptions,
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, category, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          location: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: {
        is: {
          slug: {
            equals: category,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    Object.keys(filterData).forEach((key) => {
      andConditions.push({
        [key]: {
          equals: (filterData as any)[key],
        },
      });
    });
  }

  const whereConditions: Prisma.EventWhereInput =
    andConditions.length > 0
      ? { AND: andConditions as Prisma.EventWhereInput[] }
      : {};

  const result = await prisma.event.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      category: true,
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const total = await prisma.event.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleEvent = async (req: Request) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      category: true,
      host: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return event;
};

const updateEvent = async (req: Request) => {
  const { id } = req.params;

  // Step 1: Event আছে কিনা check করুন
  const existingEvent = await prisma.event.findUnique({
    where: { id },
  });

  if (!existingEvent) {
    throw new ApiError(404, "Event not found");
  }

  // Step 2: File upload
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.eventImage = uploadResult?.secure_url;
  }

  const payload = req.body;

  // Step 3: Category validation (যদি categoryId change হয়)
  if (payload.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
  }

  // Step 4: hostId remove করে update করুন
  const { hostId, ...updateData } = payload;

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      ...updateData,
      startDateTime: updateData.startDateTime
        ? new Date(updateData.startDateTime)
        : undefined,
      endDateTime: updateData.endDateTime
        ? new Date(updateData.endDateTime)
        : undefined,
    },
    include: {
      category: true,
      host: {
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
        },
      },
    },
  });

  return updatedEvent;
};

const deleteEvent = async (req: Request) => {
  const { id } = req.params;
  const deletedEvent = await prisma.event.delete({
    where: { id },
  });
  return deletedEvent;
};

export const EventService = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
