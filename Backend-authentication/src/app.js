const express = require("express");
const authsRoute = require("../routes/auths");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");

require("dotenv").config();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ jwt: [] }],
    info: {
      title: "Auths API",
      description: "Auths information",
      contact: {
        name: "Phuong",
      },
      servers: ["http://localhost:3001"],
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use("/auths", authsRoute);

app.use((error, req, res, next) => {
  res.status(error.errorCode);
  res.json({ message: error.message });
});

mongoose
  .connect("mongodb+srv://phuong:K5p2MAuzynYdXuC@cluster0.n5gvg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
  .then(() => app.listen(3001))
  .catch((error) => console.log("MongoDB connect failed :::", error));
