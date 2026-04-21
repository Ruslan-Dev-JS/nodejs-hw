import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const uploadedImage = await saveFileToCloudinary(req.file.buffer);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: uploadedImage.secure_url,
    },
    {
      returnDocument: 'after',
    },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    url: updatedUser.avatar,
  });
};
