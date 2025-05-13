import { Contact } from '../models/contacts';

export async function getAllContactsService() {
  return await Contact.find();
}

export async function getContactById(id) {
  return await Contact.findById(id);
}
