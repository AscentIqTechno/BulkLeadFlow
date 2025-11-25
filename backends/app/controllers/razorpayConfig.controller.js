const RazorpayConfig = require("../models/razorpayConfig.model");

// ➤ CREATE Razorpay Account
exports.createRazorpayConfig = async (req, res) => {
  try {
    const { keyId, keySecret, isActive, label } = req.body;

    // Validate required fields
    if (!keyId || !keySecret) {
      return res.status(400).json({
        success: false,
        message: "Key ID and Key Secret are required"
      });
    }

    // Check if keyId already exists
    const existingConfig = await RazorpayConfig.findOne({ keyId });
    if (existingConfig) {
      return res.status(400).json({
        success: false,
        message: "Razorpay key ID already exists"
      });
    }

    // If new config is active -> deactivate all others
    if (isActive === true) {
      await RazorpayConfig.updateMany({}, { isActive: false });
    }

    const config = await RazorpayConfig.create({
      keyId,
      keySecret,
      isActive,
      label,
    });

    res.status(201).json({
      success: true,
      message: "Razorpay configuration created successfully",
      data: config,
    });
  } catch (err) {
    console.error("❌ Create Razorpay config error:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ➤ GET ALL Razorpay Configs (without sensitive keySecret)
exports.getAllRazorpayConfigs = async (req, res) => {
  try {
    const configs = await RazorpayConfig.find({})
      .select("-keySecret") // Exclude keySecret for security
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Razorpay configurations fetched successfully",
      data: configs,
      count: configs.length
    });
  } catch (err) {
    console.error("❌ Get all Razorpay configs error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Razorpay configurations",
    });
  }
};

// ➤ GET Razorpay Config by ID (without keySecret)
exports.getRazorpayConfigById = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await RazorpayConfig.findById(id).select("-keySecret");
    
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Razorpay configuration not found"
      });
    }

    res.json({
      success: true,
      message: "Razorpay configuration fetched successfully",
      data: config,
    });
  } catch (err) {
    console.error("❌ Get Razorpay config by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Razorpay configuration",
    });
  }
};

// ➤ UPDATE Razorpay Account
exports.updateRazorpayConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, keyId, keySecret, label } = req.body;

    // Check if config exists
    const existingConfig = await RazorpayConfig.findById(id);
    if (!existingConfig) {
      return res.status(404).json({
        success: false,
        message: "Razorpay configuration not found"
      });
    }

    // If keyId is being updated, check for duplicates
    if (keyId && keyId !== existingConfig.keyId) {
      const duplicateConfig = await RazorpayConfig.findOne({ keyId });
      if (duplicateConfig) {
        return res.status(400).json({
          success: false,
          message: "Razorpay key ID already exists"
        });
      }
    }

    // If account set to active -> deactivate all others
    if (isActive === true) {
      await RazorpayConfig.updateMany(
        { _id: { $ne: id } }, // Exclude current config
        { isActive: false }
      );
    }

    const updateData = {};
    if (keyId !== undefined) updateData.keyId = keyId;
    if (keySecret !== undefined) updateData.keySecret = keySecret;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (label !== undefined) updateData.label = label;

    const updatedConfig = await RazorpayConfig.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-keySecret"); // Don't return keySecret in response

    res.json({
      success: true,
      message: "Razorpay configuration updated successfully",
      data: updatedConfig,
    });
  } catch (err) {
    console.error("❌ Update Razorpay config error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update Razorpay configuration",
    });
  }
};

// ➤ DELETE Razorpay Account
exports.deleteRazorpayConfig = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if config exists
    const config = await RazorpayConfig.findById(id);
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Razorpay configuration not found"
      });
    }

    // Prevent deletion if it's the only active config
    if (config.isActive) {
      const activeConfigsCount = await RazorpayConfig.countDocuments({ isActive: true });
      if (activeConfigsCount === 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the only active Razorpay configuration. Please activate another configuration first."
        });
      }
    }

    // Delete the configuration
    await RazorpayConfig.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Razorpay configuration deleted successfully",
      data: {
        id: id,
        deleted: true
      }
    });
  } catch (err) {
    console.error("❌ Delete Razorpay config error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete Razorpay configuration",
    });
  }
};

// ➤ GET ACTIVE Razorpay Account (with keySecret - for internal use)
exports.getActiveConfig = async (req, res) => {
  try {
    const activeConfig = await RazorpayConfig.findOne({ isActive: true }).select("+keySecret");

    if (!activeConfig) {
      return res.status(404).json({
        success: false,
        message: "No active Razorpay configuration found"
      });
    }

    res.json({
      success: true,
      message: "Active Razorpay configuration fetched successfully",
      data: activeConfig,
    });
  } catch (err) {
    console.error("❌ Get active Razorpay config error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load active Razorpay configuration",
    });
  }
};

// ➤ GET ACTIVE Razorpay Public Key (for frontend - without keySecret)
exports.getActivePublicConfig = async (req, res) => {
  try {
    const activeConfig = await RazorpayConfig.findOne({ isActive: true }).select("-keySecret");

    if (!activeConfig) {
      return res.status(404).json({
        success: false,
        message: "No active Razorpay configuration found"
      });
    }

    res.json({
      success: true,
      message: "Active Razorpay public configuration fetched successfully",
      data: {
        keyId: activeConfig.keyId,
        isActive: activeConfig.isActive,
        label: activeConfig.label,
        _id: activeConfig._id
      },
    });
  } catch (err) {
    console.error("❌ Get active Razorpay public config error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load active Razorpay configuration",
    });
  }
};

// ➤ TEST Razorpay Configuration
exports.testRazorpayConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const Razorpay = require('razorpay');

    // Get config with keySecret
    const config = await RazorpayConfig.findById(id).select("+keySecret");
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Razorpay configuration not found"
      });
    }

    // Initialize Razorpay with the config
    const razorpay = new Razorpay({
      key_id: config.keyId,
      key_secret: config.keySecret,
    });

    // Test the connection by fetching payments (empty array is fine)
    const payments = await razorpay.payments.all({ count: 1 });

    res.json({
      success: true,
      message: "Razorpay configuration test successful",
      data: {
        configId: config._id,
        keyId: config.keyId,
        connection: "success",
        testResponse: payments
      }
    });
  } catch (err) {
    console.error("❌ Test Razorpay config error:", err);
    res.status(500).json({
      success: false,
      message: "Razorpay configuration test failed: " + err.message,
    });
  }
};

// ➤ SET ACTIVE Razorpay Configuration
exports.setActiveConfig = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if config exists
    const config = await RazorpayConfig.findById(id);
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Razorpay configuration not found"
      });
    }

    // Deactivate all other configs
    await RazorpayConfig.updateMany(
      { _id: { $ne: id } },
      { isActive: false }
    );

    // Activate the selected config
    const updatedConfig = await RazorpayConfig.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select("-keySecret");

    res.json({
      success: true,
      message: "Razorpay configuration activated successfully",
      data: updatedConfig,
    });
  } catch (err) {
    console.error("❌ Set active Razorpay config error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to activate Razorpay configuration",
    });
  }
};