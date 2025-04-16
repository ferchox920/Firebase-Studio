import cors from 'cors';

export const corsOptions = cors({
  origin: '*', // Cambiá por tu dominio en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
