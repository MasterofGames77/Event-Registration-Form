import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../lib/mongodb';
import Event from '../../models/Event';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();  // Ensure MongoDB connection is established

  if (req.method === 'POST') {
    const { name, email, phone, affiliation } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, Email, and Phone number are required.' });
    }

    try {
      // Check if the email is already registered
      const existingEvent = await Event.findOne({ email });

      if (existingEvent) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }

      // If not registered, create a new Event document in MongoDB
      const newEvent = new Event({ name, email, phone, affiliation });

      // Save the document to the collection
      await newEvent.save();

      // Respond with success message
      return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      // General error handling
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Registration failed', error: error.message });
      }

      // Handle other types of errors
      return res.status(500).json({ message: 'Registration failed due to an unknown error' });
    }
  } else {
    // If the request is not POST, return a 405 Method Not Allowed
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}