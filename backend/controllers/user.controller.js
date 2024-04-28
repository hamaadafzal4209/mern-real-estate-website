import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.send("Test Controller!");
}
export const updateUser = async (req, res, next) => {
    if (req.user.id != req.params.id) return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        // Check if updateUser exists and return appropriate response
        if (!updateUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // Send the updated user object in the response
        res.status(200).json(updateUser);

    } catch (error) {
        next(error);
    }
}
