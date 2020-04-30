const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
const port = process.env.PORT || 3000;

// Auto parse request body to json
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the task manager API');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});