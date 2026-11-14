import {describe, test} from "node:test"
//desctibe groups test packets that are similar, test contains 1 test decribe can contain many
import assert from "node:assert/strict"
//checks if return returns exaclty what we want

import{
    getAllUsers,
    getUserById
} from '../src/services/users.js'

describe('User Service Tests', () => {
    test('getAllUsers should return an array of users', () =>{
        const users = getAllUsers();
        assert.equal(users.length, 2);  //checks if array lenghts mach
        assert.ok(users.some(user => user.name === 'Alice'));  //checks if array contains user named alice
    })

    test('Should find user by ID', () => {
        const users = getAllUsers();
        const user = getUserById(users[0].id)
        assert.deepStrictEqual(user, users[0])
    })

    test('Should return undefined for non-existing user ID', () => {
        const user = getUserById('non-existing-id')
        assert.equal(user, undefined)
    })
});