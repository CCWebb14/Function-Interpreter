import * as chai from 'chai';
import { expect} from 'chai';
import chaiAsPromised  from 'chai-as-promised';
import request from 'supertest';
import { before, describe, it } from 'mocha'; 
import app from '../app';  
import db from '../models/db';
import { createUser, findUserByUsername, findUserById, verifyPassword } from '../models/users';

chai.use(chaiAsPromised);

describe('User Registration API', () => {
    before(async () => {
        const exists = await db.schema.hasTable('users');
        if (!exists) {
            await db.schema.createTable('users', (table) => {
                table.increments('userID').primary();
                table.string('username').notNullable().unique();
                table.string('password').notNullable();
                table.string('firstName').notNullable();
                table.string('lastName').notNullable();
                table.string('email').notNullable().unique();
            });
        }
    });
    
    const server = app; 
    const endpoint = '/api/users/register';  

    it('should register a new user successfully', (done) => {
        const newUser = {
            username: 'newuser',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'newuser@example.com',
        };

        request(server)
        .post(endpoint)
        .send(newUser)
        .expect(201)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('message', 'User created successfully');
            done();
        });
});

    it('should not allow duplicate usernames', (done) => {
        const duplicateUser = {
            username: 'newuser',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'newuser2@example.com',
        };

        request(server)
            .post(endpoint)
            .send(duplicateUser)
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Username already taken');
                done();
            });
    });

    it('should allow overlapping details but different username and email', (done) => {
        const newUser = {
            username: 'anotheruser',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'anotheruser@example.com', 
        };

        request(server)
            .post(endpoint)
            .send(newUser)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('success', true);
                expect(res.body).to.have.property('message', 'User created successfully');
                done();
            });
    });

    it('should find a user by username', async () => {
        const user = await findUserByUsername('newuser');
        expect(user).to.not.be.null;
        expect(user).to.have.property('username', 'newuser');
        expect(user).to.have.property('email', 'newuser@example.com');
    });

});

describe('User Functions', () => {
    before(async () => {
        await db.schema.hasTable('users').then(async (exists) => {
            if (!exists) {
                await db.schema.createTable('users', (table) => {
                    table.increments('userID').primary();
                    table.string('username').notNullable().unique();
                    table.string('password').notNullable();
                    table.string('firstName').notNullable();
                    table.string('lastName').notNullable();
                    table.string('email').notNullable().unique();
                });
            }
        });
    });

    it('should create a new user successfully', async () => {
        const newUser = {
            username: 'testuser',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
        };

        const result = await createUser(
            newUser.username,
            newUser.password,
            newUser.firstName,
            newUser.lastName,
            newUser.email
        );

        expect(result).to.have.property('success', true);
        expect(result).to.have.property('message', 'User created successfully');

        const user = await findUserByUsername(newUser.username);
        expect(user).to.not.be.null;
        expect(user).to.have.property('username', newUser.username);
        expect(user).to.have.property('email', newUser.email);
    });

    it('should not allow duplicate usernames', async () => {
        const duplicateUser = {
            username: 'testuser',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser2@example.com',
        };

        try {
            await createUser(
                duplicateUser.username,
                duplicateUser.password,
                duplicateUser.firstName,
                duplicateUser.lastName,
                duplicateUser.email
            );
        } catch (error) {
            if (error instanceof Error) {
                expect(error.message).to.include('UNIQUE constraint failed');
            } else {
                throw error;
            }
        }
    });


    it('should allow overlapping details but different username and email', async () => {
        const newUser = {
            username: 'anotheruser2',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            email: 'anotheruser2@example.com',
        };

        const result = await createUser(
            newUser.username,
            newUser.password,
            newUser.firstName,
            newUser.lastName,
            newUser.email
        );

        expect(result).to.have.property('success', true);
        expect(result).to.have.property('message', 'User created successfully');

        const user = await findUserByUsername(newUser.username);
        expect(user).to.not.be.null;
        expect(user).to.have.property('username', newUser.username);
        expect(user).to.have.property('email', newUser.email);
    });

    it('should find a user by username', async () => {
        const user = await findUserByUsername('testuser');
        expect(user).to.not.be.null;
        expect(user).to.have.property('username', 'testuser');
        expect(user).to.have.property('email', 'testuser@example.com');
    });

    it('should find a user by ID', async () => {
        const userByUsername = await findUserByUsername('testuser');
        expect(userByUsername).to.not.be.null;

        if (userByUsername) {
            const user = await findUserById(userByUsername.userID);
            expect(user).to.not.be.null;
            expect(user).to.have.property('username', 'testuser');
            expect(user).to.have.property('email', 'testuser@example.com');
        }
    });

    it('should verify the password correctly', async () => {
        const user = await findUserByUsername('testuser');
        expect(user).to.not.be.null;

        if (user) {
            const isValid = await verifyPassword(user, 'password123');
            expect(isValid).to.be.true;

            const isInvalid = await verifyPassword(user, 'wrongpassword');
            expect(isInvalid).to.be.false;
        }
    });
});
