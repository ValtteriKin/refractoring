import {describe, test, todo} from "node:test"
//desctibe groups test packets that are similar, test contains 1 test decribe can contain many
import assert from "node:assert/strict"
//checks if return returns exaclty what we want

import { v4 as uuidv4 } from 'uuid'

import{
    getAllUsers,
    getUserById
} from '../src/services/users.js'

import{
    PostTodo,
    getAllTodos,
    GetTodoWithID,
    PutTodo,
    DeleteTodo
} from '../src/services/todos.js'
import { title } from "node:process";

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


describe('Todo Service Tests', () => {
    test('postTodo should make new todo', () => {
        const todos = getAllTodos();
        const n = todos.length
        PostTodo({
            id: uuidv4(),
            title: 'new todo',
            description: 'new description',
            state: 'todo',   
            dueDate: new Date(),
            createdAt: new Date().toISOString(), //generates timestamps
            updatedAt: new Date().toISOString()
        })
        assert.equal(todos.length, n + 1)
    })

    test('PostTodo should throw error if title or description missing', () => {
        assert.throws(() => {
            PostTodo({
                id: uuidv4(),
                description: 'new description',
                state: 'todo',   
                dueDate: new Date(),
                createdAt: new Date().toISOString(), //generates timestamps
                updatedAt: new Date().toISOString()
            })
        }, {    
            message: 'todo filled incorectly'
        })
    })

    test('PostTodo should throw error if state incorrect', () => {
        assert.throws(() => {
            PostTodo({
                id: uuidv4(),
                 title: 'new todo',
                description: 'new description',
                state: 'non existing',   
                dueDate: new Date(),
                createdAt: new Date().toISOString(), //generates timestamps
                updatedAt: new Date().toISOString()
            })
        }, {    
            message: 'status filled incorrectly'
        })
    })

    test('getAllTodos should return an array of todos', () =>{
        const todos = getAllTodos();
        assert.equal(todos.length, 3);  //checks if array lenghts mach
        assert.ok(todos.some(todo => todo.title === 'study HTTP basics'));  //checks if array contains user named alice
    })

    test('Should find todo by ID', () => {
        const todos = getAllTodos();
        const todo = GetTodoWithID(todos[0].id)
        assert.deepStrictEqual(todo, todos[0])
    })

    test('Should return undefined for non-existing todo ID', () => {
        const todo = GetTodoWithID('non-existing-id')
        assert.equal(todo, undefined)
    })

    test('Should modify existing todo', () =>{
        const todos = getAllTodos();

        const modifiedTodo = PutTodo({
            id: todos[0].id,
            title: 'updated',
            description: 'changed',
            state: 'done',
        });

        assert.equal(modifiedTodo.title, 'updated');
        assert.equal(modifiedTodo.description, 'changed');
        assert.equal(modifiedTodo.state, 'done')
    })

    test('should throw error when todo does not exist', () =>{
        assert.throws(() =>{
            PutTodo({
                id: 'non existing id',
                title: 'updated'
            });
        }, {
            message: 'todo not found'
        })
    })

    test('Should throw error when todo left empty', () =>{
        const todos = getAllTodos();
        assert.throws(() =>{
            PutTodo({
                id: todos[0].id
            })
        }, {
            message: 'Todo left empty'
        })
    })

    test('Should delete todo with id', () => {
        const todos = getAllTodos();
        const delTodoId = todos[0].id

        DeleteTodo(delTodoId)
        const todo = GetTodoWithID(delTodoId)
        assert.equal(todo, undefined)
    })
    
    test('Should throw an error when deleting todo with non existing todo', () => {
        assert.throws(() => {
            DeleteTodo('non existing id')
        },{
            message: 'todo not found'
        })
    })
});