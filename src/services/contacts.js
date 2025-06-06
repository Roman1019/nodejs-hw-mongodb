import { Contact } from '../models/contacts.js';

export async function getAllContactsService({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find();

  contactQuery.where('userId').equals(userId);

  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (typeof filter.type !== 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
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

export async function getContactById(contactId, userId) {
  return await Contact.findById({ _id: contactId, userId });
}

export async function createContact(payload) {
  return await Contact.create(payload);
}

export async function updateContact(contactId, userId, payload) {
  return Contact.findByIdAndUpdate({ _id: contactId, userId }, payload, {
    new: true,
  });
}

export async function deleteContact(contactId, userId) {
  return Contact.findByIdAndDelete({ _id: contactId, userId });
}
