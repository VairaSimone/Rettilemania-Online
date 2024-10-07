import Reptile from "../models/Reptile.js";
import mongoose from 'mongoose';
import cloudinary from '../config/CloudinaryConfig.js';
import Feeding from "../models/Feeding.js";
import Notification from "../models/Notification.js";

export const GetAllReptile = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 20;

        const reptile = await Reptile.find({})
            .sort({ species: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await Reptile.countDocuments();
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: reptile,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        res.status(500).send();
    }
};


export const GetIDReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;
        const reptile = await Reptile.findById(id)

        if (!reptile) res.status(404).send();
        else res.send(reptile);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Not Found' });
    }
};

export const GetAllReptileByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const reptile = await Reptile.find({ user: userId })
            .sort({ species: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await Reptile.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalResults / perPage);

        if (!reptile || reptile.length === 0) {
            return res.status(404).send({ message: `No reptiles found for this person ${userId}` });
        }

        res.send({
            dati: reptile,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};


export const PostReptile = async (req, res) => {
    try {
        const { name, species, morph, user, birthDate, growthRecords, healthRecords } = req.body;

        let imageUrl = '';

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const parsedGrowthRecords = growthRecords ? JSON.parse(growthRecords) : [];
        const parsedHealthRecords = healthRecords ? JSON.parse(healthRecords) : [];

        const birthDateObject = birthDate ? new Date(birthDate) : null;

        const newReptile = new Reptile({
            _id: new mongoose.Types.ObjectId(),
            name,
            species,
            morph,
            user,
            image: imageUrl,
            birthDate: birthDateObject,
            growthRecords: parsedGrowthRecords,
            healthRecords: parsedHealthRecords,
        });

        const createdReptile = await newReptile.save();

        res.status(201).send(createdReptile);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Error creating reptile' });
    }
};

export const PutReptile = async (req, res) => {
    try {
        const id = req.params.reptileId;
        const { name, species, morph, birthDate, growthRecords, healthRecords } = req.body;

        let reptile = await Reptile.findById(id);

        if (!reptile) {
            return res.status(404).send({ message: 'Reptile not found' });
        }

        let imageUrl = reptile.image; 

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url; 
        }

        const parseDateOrNull = (value) => {
            if (!value || value === 'null') return null;
            return new Date(value);
        };

        const parseNumberOrNull = (value) => {
            if (!value || value === 'null') return null;
            return Number(value);
        };

        const parsedGrowthRecords = Array.isArray(growthRecords)
            ? growthRecords.map(record => ({
                date: parseDateOrNull(record.date),
                weight: parseNumberOrNull(record.weight),
                length: parseNumberOrNull(record.length),
            }))
            : reptile.growthRecords;

        const parsedHealthRecords = Array.isArray(healthRecords)
            ? healthRecords.map(record => ({
                date: parseDateOrNull(record.date),
                vetVisit: parseDateOrNull(record.vetVisit),
                note: record.note || '',
            }))
            : reptile.healthRecords;

        const birthDateObject = birthDate ? new Date(birthDate) : reptile.birthDate;

        reptile.name = name || reptile.name;
        reptile.species = species || reptile.species;
        reptile.morph = morph || reptile.morph;
        reptile.birthDate = birthDateObject;
        reptile.image = imageUrl;
        reptile.growthRecords = parsedGrowthRecords;
        reptile.healthRecords = parsedHealthRecords;

        const updatedReptile = await reptile.save();

        res.send(updatedReptile);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error updating reptile' });
    }
};

export const DeleteReptile = async (req, res) => {
    try {
        const reptileId = req.params.reptileId;
        const reptile = await Reptile.findById(reptileId);
        if (!reptile) return res.status(404).send({ message: 'Reptile not found' });

        await Feeding.deleteMany({ reptile: reptileId });

        await Notification.deleteMany({ reptile: reptileId });

        await Reptile.findByIdAndDelete(reptileId);

        res.send({ message: 'Reptile and associated data successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
};
