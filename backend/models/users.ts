import db from './db';

export const findUserByUsername = async (username: string) => {
    return await db('users').where({ username }).first();
};

export const findUserById = async (id: number) => {
    return await db('users').where({ id }).first();
};

export const createUser = async (username: string, password: string, firstName: string, lastName: string, email: string) => {
    await db('users').insert({
        username,
        password,
        firstName,
        lastName,
        email
    });

    //Custom success message instead of .returning() from knex
    return { success: true, message: 'User created successfully' };
};
