const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");
const router = require("./router.js");
const app = express();

app.use(express.json());
app.use(router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
