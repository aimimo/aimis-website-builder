// Express app setup
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/my-current-status", (req, res) => {
    res.json({status: "ok"});
});

app.listen(3001, () => {
    console.log("Sheeeeeeeeeee's runnnninggg outttt the DOOOOOOOR http://localhost:3001")
})