const db = require("../models");
const User = db.user;
const Subscription = db.subscription;
const Plan = db.plan;
const cloudinary = require('cloudinary').v2;
const bcrypt = require("bcryptjs");
const fs = require('fs');

// Configure Cloudinary with proper error handling
const configureCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Cloudinary configuration error:', error);
  }
};

configureCloudinary();

// Get user profile with subscription details
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate("roles", "name")
      .populate("currentPlan")
      .populate({
        path: "subscription",
        populate: {
          path: "plan",
          model: "Plan"
        }
      })
      .select("-password");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Get subscription usage if available
    let subscriptionData = null;
    if (user.subscription) {
      subscriptionData = await Subscription.findById(user.subscription);
    }

    res.status(200).send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        roles: user.roles,
        billingAddress: user.billingAddress,
        currentPlan: user.currentPlan,
        profileCompleted: user.profileCompleted,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      subscription: subscriptionData,
      usage: subscriptionData ? subscriptionData.planUsage : null
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).send({ message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
    const { username, email, phone } = req.body;

    console.log('Updating profile for user:', userId, req.body);

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).send({ message: "Email is already taken" });
      }
    }

    const updateData = {
      username,
      email,
      phone,
      profileCompleted: true
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).send({ message: err.message });
  }
};

// Upload profile image - FIXED CLOUDINARY ISSUE
// Upload Profile Image (CLOUDINARY FIXED)
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).send({ message: "No image file provided" });
    }

    console.log("Image received:", req.file.path);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "leadreachxpro/profiles",
          transformation: [{ width: 500, height: 500, crop: "fill", quality: "auto" }]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    console.log("Cloudinary Upload Success:", uploadResult);

    // Find user
    const user = await User.findById(userId);

    // Delete old image from Cloudinary
    if (user.profileImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      } catch (delErr) {
        console.warn("Old Cloudinary image not deleted:", delErr);
      }
    }

    // Update user with new image
    user.profileImage = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

    await user.save();

    // Delete temp file
    try {
      fs.unlinkSync(req.file.path);
    } catch {}

    return res.status(200).send({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage,
    });

  } catch (err) {
    console.error("Upload Profile Image Error:", err);

    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }

    return res.status(500).send({
      success: false,
      message: err.message || "Image upload failed",
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).send({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({ message: "New password must be at least 6 characters long" });
    }

    // Find user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully" });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).send({ message: err.message });
  }
};

// Get subscription details
exports.getSubscriptionDetails = async (req, res) => {
  try {
    const userId = req.userId;

    const subscription = await Subscription.findOne({ user: userId })
      .populate("plan")
      .populate("user", "username email");

    if (!subscription) {
      return res.status(404).send({ message: "Subscription not found" });
    }

    res.status(200).send({
      subscription: {
        _id: subscription._id,
        plan: subscription.plan,
        subscriptionStatus: subscription.subscriptionStatus,
        planLimits: subscription.planLimits,
        planUsage: subscription.planUsage,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
        autoRenew: subscription.autoRenew
      }
    });
  } catch (err) {
    console.error('Get subscription error:', err);
    res.status(500).send({ message: err.message });
  }
};

// Update billing address
exports.updateBillingAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { street, city, state, country, zipCode, phone } = req.body;

    const updateData = {
      billingAddress: {
        street: street || '',
        city: city || '',
        state: state || '',
        country: country || "India",
        zipCode: zipCode || '',
        phone: phone || ''
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "Billing address updated successfully",
      billingAddress: updatedUser.billingAddress
    });
  } catch (err) {
    console.error('Update billing address error:', err);
    res.status(500).send({ message: err.message });
  }
};