const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: 'Test User',
    email: 'testuser@example.com',
    password: '1234567',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]  
}

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
    _id: userTwoId,
    name: 'Test User2',
    email: 'testuser2@example.com',
    password: '12345672',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]  
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Eat lunch',
    completed: false,
    owner: userOneId._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Eat dinner',
    completed: true,
    owner: userOneId._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Eat supper',
    completed: false,
    owner: userTwoId._id
}

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();

    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}
