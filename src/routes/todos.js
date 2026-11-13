import express from 'express'
import {v4 as uuidv4} from 'uuid';
import {
    getAllUsers,
    getUserById
} from '../services/users.js'

const router = express.Router()
const now = new Date();
let todos = [
    {
        id: uuidv4(),
        title: 'study HTTP basics',
        description: 'verbs, headers etc',
        state: 'todo',
        createdAt: now,
        updatedAt: now
    },
        {
        id: uuidv4(),
        title: 'Find some literature',
        description: 'etc',
        state: 'todo',
        createdAt: now,
        updatedAt: now
    },
]

/*router.get('/', (req, res) => {
    res.json( todos )
    if(typeof state === 'string'){
        //simulate the database query
        const result = todos.filter(atodo => atodo.state === state);
        return res.status(200).json(result);
    }
    res.json( todos )
})

router.get('/:id', ( req, res ) => {
    const id = req.params.id
    const todo = todo.find(anItem => anItem.id === id)
    if ( !todo )
        return res.status(404).json({error: "Todo not found"})
    else
        return res.json( todo )
})*/


const allowedStates = ['todo', 'doing', 'done']

router.post('/', (req, res) => {   //creates a post endpoint with /todos url path
    const {title, description, state} = req.body; //data sent by put request

    if(typeof title !== 'string' || title.trim().length === 0 || typeof description !== 'string' || description.trim().length === 0){
    return res.status(400).json({
        error: 'Todo filled incorrectly'
    });
    }
    if(state !== undefined){   
        if(!allowedStates.includes(state)){
            return res.status(400).json({
            error: 'status filled incorrectly'
            });
        }
    }
    const newTodo = {
        id: uuidv4(),
        title,
        description,
        state: state || 'todo',   //|| default state
        dueDate: req.body.dueDate,
        createdAt: new Date().toISOString(), //generates timestamps
        updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
});

router.get('/', (req, res) => {
    const state = req.query.state;   //saves query parameter
   
    if (state) {   //checked if user gave a status filter
            if(!allowedStates.includes(state)){
                return res.status(400).json({
                error: 'status filled incorrectly'
            });
        }
        const filteredTodos = todos.filter(todo => todo.state === state);   //returns only those states that mach filter
        return res.status(200).json(filteredTodos);
    }

    res.status(200).json(todos);
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.find(todo => todo.id === id);  //finds todo based on id

    if(!todo) {
        return res.status(404).json({
            error: 'Todo not found'
        });
    }
    res.status(200).json(todo);
});

router.put('/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            error: 'Todo not found'
        });
    }

    const {title, description, state} = req.body; //data sent by put request

    if(title === undefined && description === undefined && state === undefined){
        return res.status(400).json({
            error: 'Todo filled incorrectly'
        });
    }

    if(title !== undefined){
        if(typeof title !== 'string' || title.trim().length === 0){
            return res.status(400).json({
                error: 'Todo filled incorrectly'
            });
        }
    }
    if(description !== undefined){
        if(typeof description !== 'string' || description.trim().length === 0){
            return res.status(400).json({
                error: 'Todo filled incorrectly'
            });
        }
    }
    if(state !== undefined){
        if(!allowedStates.includes(state)){
                return res.status(400).json({
                    error: 'Todo filled incorrectly'
                });
        }
    }
    todo.title = title ?? todo.title;  //checks whether value is null or undefined
    todo.description = description ?? todo.description;  //if value1 is not null or undefined use it.   value1 ?? value2
    todo.state = state ?? todo.state;                    // else use value2
    todo.updatedAt = new Date().toISOString();

    res.status(200).json(todo);
});


router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.findIndex(todo => todo.id === id);   //findIndex returns array index 

    if (todo === -1) {  //-1 means not found
        return res.status(404).json({
            error: 'Todo not found'
        });
    }

    const deleted = todos.splice(todo, 1);  //splice deletes at given index and number of elemnts given and return deleted items
    res.status(200).json(deleted);

});
export default router