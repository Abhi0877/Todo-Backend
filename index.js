const dotenv = require("dotenv")
const express = require("express")

const app = express()

const mongoose = require("mongoose")

const cors = require("cors")
app.use(cors({
    origin: '*',
    credentials: true,
}));
const router = require("./routes/route")

dotenv.config({ path: "./config.env" })
const DBKey = process.env.DB

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/", router)
console.log('dbkey',DBKey)

mongoose.connect(DBKey, { useNewurlParser: true })
    .then(() => { console.log("MoongoDB is connected") })
    .catch(err => console.log(err));



app.listen(process.env.PORT, function () {
    console.log('Express app running on port ' + (process.env.PORT))
});