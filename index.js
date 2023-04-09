import express from "express";
import cors from "cors";
import _db from "./util/db.js";
import router from "./routes/index.js"

const app = express();

const PORT = 5000;

app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(cors())

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server starting in port: ${PORT}`)
})