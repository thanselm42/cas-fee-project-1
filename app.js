import express from "express";
import bodyParser from "body-parser";
import {noteRoutes} from "./routes/noteRoutes.js";

export const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/api/v1/notes/", noteRoutes);

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("No token / Invalid token provided");
    } else {
        next(err);
    }
});
