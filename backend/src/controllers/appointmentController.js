import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const bookAppointment = async (req, res) => {
  try {
    const { userId, clinicId, timeSlot } = req.body;

    if (!userId || !clinicId || !timeSlot) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        clinicId,
        timeSlot: new Date(timeSlot),
        status: 'PENDING'
      }
    });

    // Queue entry logic
    let queue = await prisma.queue.findFirst({
        where: { clinicId }
      });

    if (!queue) {
      // create queue record for clinic if not exists
      queue = await prisma.queue.create({
        data: {
          clinicId,
          currentNo: 0
        }
      });
    }

    // (Optional): Add queue line record here if you expand queue model

    res.status(201).json({
      message: 'Appointment booked successfully.',
      appointment
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllAppointments = async (req, res) => {
    try {
      const appointments = await prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          clinic: {
            select: { id: true, name: true, location: true }
          }
        }
      });
  
      res.status(200).json(appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['COMPLETED', 'SKIPPED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
  
    try {
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status }
      });
  
      // On COMPLETED: increment queue.currentNo
      if (status === 'COMPLETED') {
        await prisma.queue.updateMany({
          where: { clinicId: appointment.clinicId },
          data: {
            currentNo: { increment: 1 },
            lastCalled: new Date()
          }
        });
      }
  
      res.status(200).json({ message: 'Status updated', appointment });
    } catch (err) {
      console.error('Error updating status:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
