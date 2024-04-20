const express = require('express');
const userRouter = require("./routes/userRoutes");
const courseRouter = require("./routes/courseRoutes");
const enrollmentRouter = require("./routes/enrollmentRoutes");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health-check", (req, res) => {
    res.send("Server is up and running");
});

app.use('/users', userRouter);
app.use('/courses', courseRouter);
app.use('/enrollments', enrollmentRouter)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});                     