import Feeding from "../models/Feeding.js";
import Reptile from '../models/Reptile.js';


export const GetReptileFeeding = async (req, res) => {
  try {
    const reptileId = req.params.reptileId;
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;

    const feedings = await Feeding.find({ reptile: reptileId })
      .sort({ date: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (!feedings) return res.status(404).json({ message: 'No feeding records found' });

    const totalResults = await Feeding.countDocuments({ reptile: reptileId });
    const totalPages = Math.ceil(totalResults / perPage);

    res.json({
      dati: feedings,
      totalPages,
      totalResults,
      page,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error' });
  }
};


export const PostFeeding = async (req, res) => {
  const { reptileId } = req.params;
  const { foodType, quantity, notes, date, daysUntilNextFeeding } = req.body;

  try {
    const feedingDate = new Date(date || Date.now());

    let nextFeedingDate = new Date(feedingDate);
    nextFeedingDate.setDate(nextFeedingDate.getDate() + parseInt(daysUntilNextFeeding));

    const reptile = await Reptile.findById(reptileId);
    if (!reptile) return res.status(404).json({ message: 'Reptile not found' });

    const newFeeding = new Feeding({
      reptile: reptileId,
      date: feedingDate,
      nextFeedingDate,
      foodType,
      quantity,
      notes,
    });

    const savedFeeding = await newFeeding.save();
    res.status(201).json(savedFeeding);
  } catch (error) {
    res.status(500).json({ message: 'Error creating feeding record' });
  }
};


export const PutFeeding = async (req, res) => {
  const { feedingId } = req.params;
  const { foodType, quantity, notes, date } = req.body;

  try {
    const updatedFeeding = await Feeding.findByIdAndUpdate(feedingId, {
      foodType,
      quantity,
      notes,
      date,
    }, { new: true });
    if (!updatedFeeding) return res.status(404).json({ message: 'Feeding record not found' });
    res.json(updatedFeeding);
  } catch (error) {
    res.status(500).json({ message: 'Error updating power record' });
  }
};


export const DeleteFeeding = async (req, res) => {
  const { feedingId } = req.params;

  try {
    const feeding = await Feeding.findByIdAndDelete(feedingId);
    if (!feeding) return res.status(404).json({ message: 'Feeding record not found' });
    res.json({ message: 'Power record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting power record' });
  }
};

