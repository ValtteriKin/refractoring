//npm install -save-dev supertest
import {describe, test, beforeEach, afterEach} from "node:test"
//desctibe groups test packets that are similar, test contains 1 test decribe can contain many
import request from "supertest"
import app from "../src/app.js"

import assert from "node:assert/strict"
//checks if return returns exaclty what we want 

import { v4 as uuidv4 } from 'uuid'

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
            .get(`/users/${alice.id}`)
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

describe('POST /todo', () => {
    test('responds with 200 and the todo object for the posted todo', async () => {
        const res = await request(app)
            .post(`/todos`)
            .send({
                id: uuidv4(),
                title: 'new title',
                description: 'new description',
                state: 'todo',   
                dueDate: new Date(),
                createdAt: new Date().toISOString(), //generates timestamps
                updatedAt: new Date().toISOString()
            })
            .expect('Content-Type', /json/i)
            .expect(201)
        
        assert.equal(res.body.title, 'new title');
        assert.equal(res.body.description, 'new description');
        assert.equal(res.body.state, 'todo');
    });

    test('responds with 400 when title or description missing', async() => {
        await request(app)
            .post(`/todos`)
            .send({
                id: uuidv4(),
                description: 'new description',
                state: 'todo',   
                dueDate: new Date(),
                createdAt: new Date().toISOString(), //generates timestamps
                updatedAt: new Date().toISOString()
            })
            .expect(400)
    })

    test('responds with 400 when state incorrect', async() => {
        await request(app)
            .post(`/todos`)
            .send({
                id: uuidv4(),
                title: 'new title',
                description: 'new description',
                state: 'non existing state',   
                dueDate: new Date(),
                createdAt: new Date().toISOString(), //generates timestamps
                updatedAt: new Date().toISOString()
            })
            .expect(400)
    })
})


describe('GET /todos', () => {
    test('responds with 200 and JSON', async () =>  {
        const res = await request(app)
            .get('/todos')
            .expect('Content-Type', /json/i) //i = checks that it is exactly json
            .expect(200) //checks that result is 200
        assert.ok(Array.isArray(res.body)) //checks if res.body is js array
        
    })
})

describe('GET /todos/:id', () => {
    test('responds with 200 and the todo object for existing todo', async () => {
        const todos = await request(app)
            .get('/todos')
            .expect(200)
        const todo = todos.body.find(todo => todo.title === 'study HTTP basics')

        assert(todo, 'todo should exist in the todo list')
        const res = await request(app)
            .get(`/todos/${todo.id}`)
            .expect('Content-Type', /json/i)
            .expect(200)
        assert.deepStrictEqual(res.body, todo)
    })

    test('responds with 404 for non-existing todo', async () => {
        await request(app)
            .get('/todos/9999999')
            .expect(404)
    })
})

describe('PUT /todo/:id', () => {
    test('responds with 200 and the todo object for the changed todo', async () => {
        const todos = await request(app)
            .get('/todos')
            .expect(200)
        const todo = todos.body[0]

        const res = await request(app)
            .put(`/todos/${todo.id}`)
            .send({
                title: 'Updated title',
                description: 'Updated description',
                state: 'todo'
            })
            .expect('Content-Type', /json/i)
            .expect(200)
        
        assert.equal(res.body.title, 'Updated title');
        assert.equal(res.body.description, 'Updated description');
        assert.equal(res.body.state, 'todo');
    });

    test('responds with 404 for non-existing todo', async () => {
        await request(app)
            .put('/todos/999999999')
            .send({
                title: 'Updated title'
            })
            .expect(400);
    })
})

describe('DELETE /todos/id', () => {
    test('responds with 200 and the todo object for the deleted todo', async () => {
        const todos = await request(app)
            .get('/todos')
            .expect(200)
        const todo = todos.body[0]

        await request(app)
            .delete(`/todos/${todo.id}`)
            .expect('Content-Type', /json/i)
            .expect(200)

        await request(app)
            .get(`/todos/${todo.id}`)
            .expect(404)
    })
    test('responds with 400 for non-existing todo', async () => {
        await request(app)
            .delete('/todos/9999999')
            .expect(400)
    })
})