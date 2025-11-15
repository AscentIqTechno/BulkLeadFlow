const express = require("express");
const router = express.Router();

const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

// CORS Headers (optional)
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// PUBLIC
router.get("/test/all", controller.allAccess);

// USER BOARD
router.get("/test/user", [authJwt.verifyToken], controller.userBoard);

// MODERATOR BOARD
router.get(
  "/test/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.moderatorBoard
);

// ADMIN BOARD
router.get(
  "/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.adminBoard
);

// GET ALL USERS (ADMIN ONLY)
router.get(
  "/all",
  controller.getAllUsers
);
// UPDATE USER (ADMIN ONLY)
router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser);
router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);

module.exports = router;
