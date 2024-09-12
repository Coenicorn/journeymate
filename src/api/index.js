const router = require("express").Router();

// this file serves as the root for api calls under #/api/
// if you want to interact with endpoints listed below, call them by their respective
// endpoint name, e.g. #/api/auth

router.use("/auth", require("./auth"));
router.use("/planner", require("./planner"));
router.use("/game", require("./game"));
router.use("/user", require("./user"));

module.exports = router;