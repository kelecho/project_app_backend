import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js"

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//Configurar CORS
const whitelist = [process.env.FRONTEND_URL, 
                  process.env.DATABASE_URI];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      //Puede consultar la API
      callback(null, true);
    } else {
      //No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

//app.use(cors(corsOptions));
app.use(cors());

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/pagos", pagosRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
