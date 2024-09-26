import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from 'express-validator';
import RevokedToken from '../models/RevokedToken.js';

//generate the access token with a shorter duration
const generateAccessToken = (user) => {
    return jwt.sign({ userid: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

//generate the refresh token with a longer duration that will be used to request the access token
const generateRefreshToken = (user) => {
    return jwt.sign({ userid: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json({ message: "Error in the credentials entered" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Error in the credentials entered" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" });
    }
};

export const register = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) return res.status(409).send("Email address already used");

            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar
            });

            const createdUser = await newUser.save();
            return res.status(201).json(createdUser);
        } catch (error) {
            return res.status(500).json({ message: "Server Error" });
        }
    }
];

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userid).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({ message: "Token not found" });

    try {
        const user = await User.findOne({ refreshToken: token });
        if (!user) return res.status(400).json({ message: "Invalid token" });

        const decoded = jwt.decode(token);
        if (!decoded) return res.status(400).json({ message: "Invalid token decoding" });

        const revokedToken = new RevokedToken({
            token,
            expiresAt: new Date(decoded.exp * 1000) 
        });
        await revokedToken.save();

        user.refreshToken = null;
        await user.save();

        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            sameSite: 'strict', 
            secure: process.env.NODE_ENV === 'production' 
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const callBackGoogle = async (req, res) => {
    try {
        const token = req.user.jwtToken;
        if (!token) return res.status(401).send("Autenticazione fallita");

        const { googleId, name } = req.user; 

        let user = await User.findOne({ googleId });

        if (!user) {
            user = new User({
                googleId,
                name: name || "User",
            });

            await user.save();
        }

        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        res.redirect(`${process.env.FRONTEND_URL}/login-google-callback?token=${token}`);
    } catch (err) {
        console.error("Errore nell'autenticazione con Google:", err);
        res.status(500).send("Errore del server");
    }
};