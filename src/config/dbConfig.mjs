import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();



import dns from 'dns/promises';//tomado del práctico anterior
dns.setServers(["8.8.8.8", "1.1.1.1"]);//tomado del páctico anterior

export async function connectDB() { 
  try { 
    // await mongoose.connect('mongodb+srv://grupo-15:grupo-15@cluster0.blryo.mongodb.net/NodeMod3Cohorte5');
    await mongoose.connect(process.env.MONGODB_URI);//nueva función asincrónica para esconder  acceso arriba comentado
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) { 
    console.error('❌ Error al conectar a MongoDB:', error); 
    process.exit(1); 
  } 
}