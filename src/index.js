const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const fs = require("fs");
const app = express();
const event = require("./models/student.js");
const dbManager = require("./dbManager.js");
const router = require("./router.js");

app.use(express.json());
app.use(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
