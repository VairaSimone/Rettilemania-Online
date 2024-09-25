import User from "../models/User.js";
import Reptile from "../models/Reptile.js";
import Feeding from "../models/Feeding.js";
import Notification from "../models/Notification.js";
import RevokedToken from "../models/RevokedToken.js";
import jwt from "jsonwebtoken";

export const GetAllUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 20;

        const user = await User.find({})
            .sort({ name: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await User.countDocuments();
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: user,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        res.status(500).send();
    }
};


export const GetIDUser = async (req, res) => {
    try {
        const id = req.params.userId;

        const user = await User.findById(id);
        if (!user) res.status(404).send();
        else res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Not Found' });
    }
};

export const PutUser = async (req, res) => {
    try {
        const id = req.params.userId;
        const userData = req.body;

        const user = await User.findByIdAndUpdate(id, userData, { new: true });
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
};

export const DeleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const reptiles = await Reptile.find({ user: userId });

        for (const reptile of reptiles) {
            await Feeding.deleteMany({ reptile: reptile._id });
            await Notification.deleteMany({ reptile: reptile._id });
        }

        await Reptile.deleteMany({ user: userId });

        await Notification.deleteMany({ user: userId });

        await User.findByIdAndDelete(userId);

        const token = req.header('Authorization')?.split(' ')[1];
        if (token) {
            const decoded = jwt.decode(token);
            if (decoded) {
                const revokedToken = new RevokedToken({
                    token,
                    expiresAt: new Date(decoded.exp * 1000),
                });
                await revokedToken.save();
            }
        }

        return res.status(200).json({ message: 'User and associated data successfully deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
