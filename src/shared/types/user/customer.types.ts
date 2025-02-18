export type Customer = {
  id: number;
  publicId: string;
  firstname: string;
  lastname: string;
  country: string;
  emails: string[];
  phones: string[];
  role: string;
  lastTimeOnline?: Date;
  createdAt?: Date;
};
