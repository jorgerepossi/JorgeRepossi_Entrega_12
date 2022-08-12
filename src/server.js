/*
Entrega 12 - Clase 24
Alumno: Jo Repossi
Backend: NodeJS
Comisión 30995
Profesor: Diego Jofre
Fecha: Jueves 11 Agosto 2022
**/

import express from "express";
import "dotenv/config";

import loginRouter from "./routes/userRouter.js";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(loginRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running");
});
