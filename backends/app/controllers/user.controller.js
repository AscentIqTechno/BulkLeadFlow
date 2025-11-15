exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized: Missing user id" });
  }
  res.status(200).send(`User Content. UserId: ${req.userId}`);
};

exports.adminBoard = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized: Missing user id" });
  }
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  if (!req.userId) {
    return res.status(401).send({ message: "Unauthorized: Missing user id" });
  }
  res.status(200).send("Moderator Content.");
};
