//npm install -save-dev supertest
import {describe, test, beforeEach, afterEach} from "node:test"
//desctibe groups test packets that are similar, test contains 1 test decribe can contain many
import request from "supertest"
import app from "../src/app.js"

import assert from "node:assert/strict"
//checks if return returns exaclty what we want 

beforeEach(() => {
    //setup code before each test, if needed
})
afterEach(() =>{
    //cleanup code after each test, if needed
})

describe('GET /users', () => {
    test('responds with 200 and JSON', async () =>  {
        const res = await request(app)
            .get('/users')
            .expect('Content-Type', /json/i) //i = checks that it is exactly json
            .expect(200) //checks that result is 200
        assert.ok(Array.isArray(res.body)) //checks if res.body is js array
        
    })
})

describe('GET /users/:id', () => {
    test('responds with 200 and the user object for existing user', async () => {
        const users = await request(app)
            .get('/users')
            .expect(200)
        const alice = users.body.find(user => user.name === 'Alice')

        assert(alice, 'Alice should exist in the user list')
        const res = await request(app)
            .get('/users/', alice.id)
            .expect('Content-Type', /json/i)
            .expect(200)
        assert.deepStrictEqual(res.body, alice)
    })

    test('responds with 404 for non-existing user', async () => {
        await request(app)
            .get('/users/9999999')
            .expect(404)
    })

    //the most common status codes
    //200 ok
    //201 created
    //400 bad request
    //401 unothorised
    //403 forbidden
    //404 Not Found
    //500 internal service error
})