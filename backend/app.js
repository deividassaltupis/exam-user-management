import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import crypto from "crypto";

import { User } from "./models/User.js";

dotenv.config();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const HASH_SECRET_KEY = process.env.HASH_SECRET_KEY;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI).then(() => {
    console.log(`Successfully connected to MONGO DB`);
    app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
});

app.get("/", (req, res) => res.send("API is running"));

app.get("/api/users/", async (req, res) => {
    const userArray = await User.find();
    const filteredUserArray = userArray.map((user) => {
        const userObj = { ...user._doc };
        delete userObj.password;
        return userObj;
    });
    res.send(filteredUserArray);
});

app.post("/api/users/", async (req, res) => {
    if (!req.body.user)
        return res.status(400).json({
            error: true,
            message: "Klaidinga užklausa.",
        });

    const name = req.body.user.name;
    const age = +req.body.user.age;
    const email = req.body.user.email;
    const password = req.body.user.password;

    if (!name || !age || !email || !password)
        return res.status(400).json({
            error: true,
            message:
                "Būtina nurodyti: vartotojo vardą, amžių, el.paštą, bei slaptažodį.",
        });

    const emailExists = await User.findOne({ email: email });
    if (emailExists)
        return res.status(401).json({
            error: true,
            message: "Vartotojos su nurodytų el.paštų jau yra užregistruotas",
        });

    const hashedPassword = crypto
        .createHmac("sha256", HASH_SECRET_KEY)
        .update(password)
        .digest("hex");

    const newUser = new User({
        name: name,
        age: age,
        email: email,
        password: hashedPassword,
    });

    const createdUser = await newUser.save();
    if (createdUser) {
        const userObj = { ...createdUser._doc };
        delete userObj.password;
        res.send({ user: userObj });
    } else
        res.status(401).json({
            error: true,
            message: "Serveryje įvyko nesklandumų, nepavyko sukurti vartotojo.",
        });
});

app.put("/api/users/:id", async (req, res) => {
    if (!req.params.id)
        res.status(401).json({
            error: true,
            message: "Trūksta vartotojo ID parametro !",
        });

    if (!req.body.user)
        return res.status(400).json({
            error: true,
            message: "Klaidinga užklausa.",
        });

    const userID = req.params.id;
    const doesUserExist = await User.findOne({ _id: userID });
    if (!doesUserExist)
        return res.status(401).json({
            error: true,
            message: "Vartotojas su nurodytų ID nerastas duomenų bazėje.",
        });

    const name = req.body.user.name;
    const age = +req.body.user.age;
    const email = req.body.user.email;
    const password = req.body.user.password;

    if (!name || !age || !email)
        return res.status(400).json({
            error: true,
            message:
                "Būtina nurodyti naują: vartotojo vardą, amžių, el.paštą, bei slaptažodį.",
        });

    const userUpdateObj = {
        name: name,
        age: age,
        email: email,
    };
    if (password != "") {
        const hashedPassword = crypto
            .createHmac("sha256", HASH_SECRET_KEY)
            .update(password)
            .digest("hex");
        userUpdateObj.password = hashedPassword;
    }

    await User.findByIdAndUpdate(userID, userUpdateObj);
    const updatedUser = await User.findOne({ _id: userID });
    if (updatedUser) {
        const userObj = { ...updatedUser._doc };
        delete userObj.password;
        res.json({ user: userObj });
    } else
        res.status(401).json({
            error: true,
            message:
                "Serveryje įvyko nesklandumų, nepavyko atnaujinti vartotoją.",
        });
});

app.delete("/api/users/:id", async (req, res) => {
    if (!req.params.id)
        res.status(401).json({
            error: true,
            message: "Trūksta vartotojo ID parametro !",
        });

    const userID = req.params.id;
    const deletedUser = await User.findByIdAndRemove(userID);
    if (!deletedUser)
        return res.status(401).json({
            error: true,
            message:
                "Serveryje įvyko nesklandumų, nepavyko pašalinti vartotoją.",
        });
    else
        return res.json({
            message: "Vartotojas sėkmingai pašalintas",
            user: deletedUser,
        });
});
