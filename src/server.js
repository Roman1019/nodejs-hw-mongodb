import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

import { Contact } from './models/contactsSchema.js';

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());

  app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find(); // отримуємо всі контакти
      res.json({
        data: contacts,
      });
    } catch (error) {
      console.error('Error fetching contacts:', error); // Логування помилки
      res
        .status(500)
        .json({ message: 'Error retrieving contacts', error: error.message });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
