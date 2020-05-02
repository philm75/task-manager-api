const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

// Runs before each test case...
beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const response = await request(app)
         .post('/users')
         .send({
             name: 'Phil',
             email: 'phil@example.com',
             password: '1234567'
    }).expect(201); 

    const user = await User.findById(response.body.user._id);        
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Phil',
            email: 'phil@example.com'
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('fgkjfgjofgljfgjl');
});

test('Should login with existing test user', async () => {
    const response = await request(app)
                            .post('/users/login')
                            .send(userOne).expect(200); 

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login with a nonexistent user', async () => {
    await request(app)
         .post('/users/login')
         .send({
            name: 'Testing...',
            email: 'testing@example.com',
            password: '1234567'             
         }).expect(401); 
});

test('Should get profile for user', async () => {
    await request(app)
         .get('/users/me')
         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
         .send()
         .expect(200); 
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
         .get('/users/me')
         .send()
         .expect(401); 
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
         .delete('/users/me')
         .send()
         .expect(401); 
});

test('Should delete account for user', async () => {
    await request(app)
         .delete('/users/me')
         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
         .send()
         .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));    
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Philip'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Philip');    
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Tynemouth'
        })
        .expect(400);
});

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated