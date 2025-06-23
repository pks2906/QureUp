import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getClinicQueue = async (req, res) => {
  const { clinicId } = req.params;

  try {
    const queue = await prisma.queue.findFirst({ where: { clinicId } });

    if (!queue) {
      return res.status(404).json({ error: 'Queue not found for clinic.' });
    }

    const pendingAppointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: { select: { name: true, id: true } }
      }
    });

    const nextPatient = pendingAppointments[0];

    res.status(200).json({
      clinicId,
      currentNo: queue.currentNo,
      totalPending: pendingAppointments.length,
      nextPatient,
      lastCalled: queue.lastCalled,
    });
  } catch (err) {
    console.error('Error fetching queue:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
