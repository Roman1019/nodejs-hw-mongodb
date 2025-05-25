import { Contact } from '../models/contacts.js';

export async function getAllContactsService({ page, perPage }) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(),
    Contact.find().skip(skip).limit(perPage),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
}

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

export async function createContact(payload) {
  return await Contact.create(payload);
}

export async function updateContact(contactId, payload) {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true });
}

export async function deleteContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}
