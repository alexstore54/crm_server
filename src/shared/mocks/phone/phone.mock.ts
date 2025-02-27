import { Phone } from '@prisma/client';

export const getMockedMainPhone = (): Phone => ({
  phone: '123456789',
  isMain: true,
  created_at: new Date(),
  leadId: 1,
  id: 1,
})

export const getMockedPhone = (): Phone => ({
  phone: '123456789',
  isMain: false,
  created_at: new Date(),
  leadId: 1,
  id: 1,
})