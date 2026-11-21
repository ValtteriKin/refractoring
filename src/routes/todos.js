import express from 'express'
import {v4 as uuidv4} from 'uuid';
import {
    DeleteTodo,
    getAllTodos,
    GetTodoWithID,
    PostTodo,
    PutTodo
} from '../services/todos.js'

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

router.post('/', (req, res) => {   //creates a post endpoint with /todos url path'
    try{
        const newTodo = PostTodo(req.body); //data sent by put request
        res.status(201).json(newTodo);
    }catch(error) {
        return res.status(400).json({
            error: error.message
        })
    }
});

router.get('/', (req, res) => {
    try{
        const state = req.query.state;   //saves query parameter
        res.status(200).json(getAllTodos(state))
    }catch (error){
        res.status(400).json({
            error: error.message
        })  
    }
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const todo = GetTodoWithID(id);

    if(!todo) {
        return res.status(404).json({
            error: 'Todo not found'
        });
    }
    res.status(200).json(todo);
});

router.put('/:id', (req, res) => {
    try {
        const EdTodo = PutTodo({
            id: req.params.id,
            ...req.body   //copies all properties from request
        })
        res.status(200).json(EdTodo);
    }catch (error){
        res.status(400).json({
            error: error.message
        })  
    }

});


router.delete('/:id', (req, res) => {
    try{
        const id = req.params.id;
        res.status(200).json(DeleteTodo(id));
    }catch{
        res.status(400).json({
            error: error.message
        })  
    }
    
});
export default router