import express from "express";
import bodyParser from "body-parser";
import noteRoutes from "./routes/noteRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";

const hostname = "127.0.0.1";
const port = 3042;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/api/v1/notes/", noteRoutes);
app.use("/api/v1/quotes/", quoteRoutes);

app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${hostname}:${port}/`);
});
