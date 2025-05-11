import { Contact } from '../models/contactsSchema.js';

export async function getAllContactsService() {
  return await Contact.find();
}

export async function getContactById(id) {
  return await Contact.findById(id);
}
