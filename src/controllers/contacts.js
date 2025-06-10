import createError from 'http-errors';
import * as fs from 'node:fs/promises';
import {
  createContact,
  deleteContact,
  getAllContactsService,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import createHttpError from 'http-errors';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export async function getContactsController(req, res) {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContactsService({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res
      .status(500)
      .json({ message: 'Error retrieving contacts', error: error.message });
  }
}

export async function getContactByIDController(req, res) {
  const userId = req.user?._id;

  if (!userId) {
    throw createHttpError.Unauthorized('User not authenticated');
  }
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId, userId);

  if (contact === null) {
    throw createError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  let photo = null;
  const result = await uploadToCloudinary(req.file.path);
  await fs.unlink(req.file.path);
  photo = result.secure_url;

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  let photo = null;
  if (req.file) {
    const resultUpload = await uploadToCloudinary(req.file.path);
    console.log(resultUpload);

    await fs.unlink(req.file.path);
    photo = resultUpload.secure_url;
    req.body.photo = photo;
  }

  const contactId = req.params.contactId;
  const result = await updateContact(contactId, req.user._id, req.body);
  if (result === null) {
    throw createError(404, 'Contact not found');
  }
  console.log('req.file', req.file);

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
}

export async function deleteContactController(req, res) {
  const contactId = req.params.contactId;
  const result = await deleteContact(contactId, req.user._id);
  if (!result) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).end();
}
