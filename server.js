const app = require("express")();
const { json } = require("express");

const cors = require("./config/cors");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./api/swagger");
const forumRouter = require("./api/forumapi");
const PORT = process.env.PORT;

app.use(process.env.API_DOC_PATH, swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(process.env.API_PATH, json(), cors, forumRouter);

app.listen(PORT);