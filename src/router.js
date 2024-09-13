const express = require("express");
const router = express.Router();

const appointmentRoute = require("./routes/appointmentRoutes");
const eventRoute = require("./routes/eventRoutes");
const professionalRoute = require("./routes/professionalRoutes");
const studentRoute = require("./routes/studentRoutes");
const teacherRoute = require("./routes/teacherRoutes");
const userRoute = require("./routes/userRoutes");

router.use("/appointments", appointmentRoute);
router.use("/events", eventRoute);
router.use("/professionals", professionalRoute);
router.use("/students", studentRoute);
router.use("/teachers", teacherRoute);
router.use("/users", userRoute);

module.exports = router;
