import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const registerClinic = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const clinic = await prisma.clinic.create({
      data: { name, location },
    });

    res.status(201).json({ message: 'Clinic registered successfully.', clinic });
  } catch (error) {
    console.error('Error registering clinic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllClinics = async (req, res) => {
    try {
      const clinics = await prisma.clinic.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(clinics);
    } catch (err) {
      console.error('Error fetching clinics:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  