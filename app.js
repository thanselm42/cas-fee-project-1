import express from "express";
import bodyParser from "body-parser";
import noteRoutes from "./routes/noteRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";

// eslint-disable-next-line import/prefer-default-export
export const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/api/v1/notes/", noteRoutes);
app.use("/api/v1/quotes/", quoteRoutes);

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("No token / Invalid token provided");
    } else {
        next(err);
    }
});
