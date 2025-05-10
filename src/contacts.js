import { Contact } from '../models/contactsSchema.js';

export async function getAllContactsService() {
  return await Contact.find(); // Повертає всі контакти
}
// import app from './server.js';
// import express from 'express';
// import mongoose from 'mongoose';
// import { Contact } from './models/contactsSchema.js';

// app.get('/api/contacts', async (req, res) => {
//   const contacts = await Contact.find();
//   res.json({
//     data: contacts,
//   });
// });
