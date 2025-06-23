import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const user = await prisma.user.create({
      data: { name, email, phone, role: role || 'PATIENT' },
    });

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  