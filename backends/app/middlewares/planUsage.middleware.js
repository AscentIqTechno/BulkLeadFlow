const db = require("../models");
const Subscription = db.subscription;

// module.exports = async function planUsageMiddleware(req, res, next) {
//   try {
//     const subscription = await Subscription.findOne({
//       user: req.userId,
//       isActive: true
//     });

//     if (!subscription) {
//       return res.status(403).json({
//         success: false,
//         message: "No active subscription"
//       });
//     }

//     // Ensure nested objects exist inside Mongoose document (NOT copies)
//     if (!subscription.planLimits) subscription.planLimits = {};
//     if (!subscription.planUsage) subscription.planUsage = {};

//     subscription.planLimits.emailsPerMonth ??= 0;
//     subscription.planLimits.smsPerMonth ??= 0;
//     subscription.planLimits.smtpConfigs ??= 0;
//     subscription.planLimits.androidGateways ??= 0;

//     subscription.planUsage.emailsSent ??= 0;
//     subscription.planUsage.smsSent ??= 0;
//     subscription.planUsage.smtpConfigsUsed ??= 0;
//     subscription.planUsage.androidGatewaysUsed ??= 0;
//     subscription.planUsage.lastResetDate ??= new Date();

//     // Save updated fields to ensure mongoose document is ready
//     subscription.markModified("planLimits");
//     subscription.markModified("planUsage");
//     await subscription.save();

//     // CHECK LIMITS
//     if (
//       subscription.planLimits.smtpConfigs !== -1 &&
//       subscription.planUsage.smtpConfigsUsed >= subscription.planLimits.smtpConfigs
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "SMTP Config limit reached"
//       });
//     }

//     // Attach REAL mongoose document only
//     req.subscription = subscription;

//     next();

//   } catch (err) {
//     console.log("PLAN USAGE ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Subscription check failed",
//       error: err.message
//     });
//   }
// };


module.exports = async function planUsageMiddleware(req, res, next) {
    try {
        const subscription = await Subscription.findOne({
            user: req.userId,
            subscriptionStatus: "active",
        });
        // Check plan limit first
        if (req.subscription) {
            const { smtpConfigsUsed } = req.subscription.planUsage;
            const { smtpConfigs } = req.subscription.planLimits;

            if (smtpConfigs !== -1 && smtpConfigsUsed >= smtpConfigs) {
                return res.status(403).json({
                    success: false,
                    message: `SMTP Config limit reached — your plan allows only ${smtpConfigs} configs`
                });
            }

            // Increment counter
            req.subscription.planUsage.smtpConfigsUsed += 1;
            await req.subscription.save();
        }

        // Attach the full mongoose document
        req.subscription = subscription;

        next();
    } catch (err) {
        console.error("PLAN USAGE ERROR:", err);
        res.status(500).json({ success: false, message: "Subscription check failed" });
    }
};
