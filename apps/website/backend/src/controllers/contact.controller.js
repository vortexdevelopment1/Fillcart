import { ContactService } from "../services/contact.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const contactService = new ContactService();

export const createContact = asyncHandler(async (req, res) => {
  const result = await contactService.createMessage(req.validated.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});
