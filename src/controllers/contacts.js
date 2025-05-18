import createError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContactsService,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export async function getContactsController(req, res) {
  try {
    const contacts = await getAllContactsService();
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
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId);
  console.log(contact);
  if (contact === null) {
    return res.status(404).send({ message: 'Contact not found' });
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const contactId = req.params.contactId;
  const result = await updateContact(contactId, req.body);
  if (result === null) {
    throw createError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
}

export async function deleteContactController(req, res) {
  const contactId = req.params.contactId;
  const result = await deleteContact(contactId);
  if (result === true) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).end();
}
