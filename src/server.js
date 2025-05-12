import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { Contact } from './contacts.js';
import mongoose from 'mongoose';

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
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
  });

  app.get('/api/contacts/:id', async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact Id' });
    }

    const contact = await Contact.findById(id);
    console.log(contact);
    if (contact === null) {
      return res.status(404).send({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${id}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, '0.0.0.0', (error) => {
    if (error) {
      console.error('Error starting server:', error);
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
