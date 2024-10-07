import RevokedToken from '../models/RevokedToken.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//Refresh Token Management. Requests an Access Token if expired and saves the Refresh Token in cookies
export const refreshToken = async (req, res) => {


    const generateAccessToken = (user) => {
        return jwt.sign({ userid: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7h' });
    };
    
    const generateRefreshToken = (user) => {
        return jwt.sign({ userid: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    };

    const token = req.cookies.refreshToken;
    if (!token) return res.status(403).json({ message: "Refresh token missing" });

    try {
        const isRevoked = await RevokedToken.findOne({ token });
        if (isRevoked) return res.status(403).json({ message: "Token Revoked" });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userid);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Update the refresh token in the DB
        user.refreshToken = newRefreshToken;
        await user.save();

        // Add the old refresh token to the list of revoked tokens
        if (!isRevoked && decoded.exp * 1000 > Date.now()) {
            const revokedToken = new RevokedToken({
                token,
                expiresAt: new Date(decoded.exp * 1000)
            });
            await revokedToken.save();

        }
        // Send the new refresh token and access token
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
        });

        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
