import mongoose from "mongoose";

const USER = "devuser";
const PASSWORD = "3ObrQv4voZcbi5EH";
const URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.srqlkqk.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(
    URL,
    { dbName: "projectX" }
);

const db = mongoose.connection;

db.on("error", err => {
    console.log("Error connecting to database", err);
});

db.once("open", function () {
    console.log("Connected to database...")
});

export default db