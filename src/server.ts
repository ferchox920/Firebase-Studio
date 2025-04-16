import app from './app';
import { AppDataSource } from './config/database'; // 👈 Importá tu conexión aquí

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Conectado con TypeORM a PostgreSQL');
 console.log('HOLA DESDE MI MOBIL')
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando TypeORM:', error);
  });
