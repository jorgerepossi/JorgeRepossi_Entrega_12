/**
 * Entrega 12 - Clase 24
 * Alumno: Jo Repossi
 * Backend: NodeJS
 * Comisión 30995
 * Profesor: Diego Jofre
 * Fecha: Jueves 11 Agosto 2022
 */

const express = require("express");
const path = require("path");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const connectMongo = require("connect-mongo");
const session = require("express-session");
const exphbs = require("express-handlebars");

require('dotenv').config('.env');

const process = require('process');


const productsController = require("./src/controller/productController");
const messagesController = require("./src/controller/messageController");



const options = { useNewUrlParser: true, useUnifiedTopology: true };
const MongoStore = connectMongo.create({
  mongoUrl: process.env.MONGO_URL,
  mongoOptions: options,
  ttl: 60,
});

const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);




app.set("view engine", "handlebars");

// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname + "/public/views"));

app.engine("handlebars", exphbs.engine());

app.use(express.json());
app.use(express.urlencoded({ extend: true }));

// eslint-disable-next-line no-undef
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: MongoStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", require("./src/routes/login"));



io.on("connection", (socket) => {
  socket.emit("socketConnected");

  socket.on("productListRequest", async () => {
    const allProducts = await productsController.getAllProducts();
    socket.emit("updateProductList", allProducts);
  });

  socket.on("chatMessagesRequest", async () => {
    const allMessages = await messagesController.getAllMessages();
    socket.emit("updateChatRoom", allMessages);
  });

  socket.on("addNewProduct", async (newProduct) => {
    await productsController.addNewProduct(newProduct);
    const allProducts = await productsController.getAllProducts();
    socket.emit("updateProductList", allProducts);
  });

  socket.on("addNewMessage", async (newMessage) => {
    await messagesController.addNewMessage(newMessage);
    const allMessages = await messagesController.getAllMessages();
    socket.emit("updateChatRoom", allMessages);
  });
});

const PORT = port;
const server = httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
server.on("error", (err) => console.error(err));
