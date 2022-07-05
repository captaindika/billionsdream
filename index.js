const express = require("express");
const cors = require("cors");
const yaml = require('yamljs')
require("dotenv").config();
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./src/route/route.user");
const dbConnect = require("./src/config/db");
const swaggerDocument = yaml.load('./swagger.yaml');

const app = express();

dbConnect();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.json({ message: `Hey! This is your server response!\n visit ${process.env.HOST}/api-docs for see api documentation ` });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/user", userRoutes);
app.use((req, res, next) => {
    const error = new Error("Route Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

// Start Server
app.set("port", process.env.PORT || 4000);
const server = app.listen(app.get("port"), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});