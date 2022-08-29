const express = require("express");
const cors = require("cors");

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const connectMongo = require("connect-mongo");
const session = require("express-session");
const exphbs = require("express-handlebars");

const productsController = require("./src/controller/productController");
const messagesController = require("./src/controller/messageController");

const options = { useNewUrlParser: true, useUnifiedTopology: true };
const MongoStore = connectMongo.create({
  mongoUrl:
    "mongodb+srv://coder:coder123@coder.ljncabt.mongodb.net/?retryWrites=true&w=majority",
  mongoOptions: options,
  ttl: 60,
});

const app = express();

httpServer = new HttpServer(app);
io = new IOServer(httpServer);

app.set("view engine", "handlebars");
app.set("views", __dirname + "/public/views");
app.engine("handlebars", exphbs.engine());

app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: MongoStore,
    secret: "12345",
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

const PORT = 8080;
const server = httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
server.on("error", (err) => console.error(err));
