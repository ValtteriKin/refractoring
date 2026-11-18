// requires npm install uuid
import { v4 as uuidv4 } from 'uuid'

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
        state: 'doing',
        createdAt: now,
        updatedAt: now
    },
]

const allowedStates = ['todo', 'doing', 'done']


export function PostTodo(todo){   //creates a post endpoint with /todos url path

    if(typeof todo.title !== 'string' || todo.title.trim().length === 0 || typeof todo.description !== 'string' || todo.description.trim().length === 0){
        throw new error('todo filled incorectly')
    }
    if(todo.state !== undefined){   
        if(!allowedStates.includes(todo.state)){
            throw new Error('status filled incorrectly')
        }
    }
    const newTodo = {
        id: uuidv4(),
        title: todo.title,
        description: todo.description,
        state: todo.state || 'todo',   //|| default state
        dueDate: todo.dueDate,
        createdAt: new Date().toISOString(), //generates timestamps
        updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);

    return newTodo;
}


export function getAllTodos(state = null){
    if (state) {   //checked if user gave a status filter
            if(!allowedStates.includes(state)){
                throw new Error('status filled incorrectly')
        }
        const filteredTodos = todos.filter(todo => todo.state === state);   //returns only those states that mach filter
        return filteredTodos
    }
    return todos
}

export function GetTodoWithID(id){
    return todos.find(todo => todo.id === id);  //finds todo based on id
}

export function PutTodo(todo){
    const id = todo.id;

    const EdTodo = todos.find(todo => todo.id === id);

    if (!EdTodo) {
        throw new Error('todo not found')
    }

    if(todo.title === undefined && todo.description === undefined && todo.state === undefined){
        throw new Error('Todo left empty')
    }

    if(todo.title !== undefined){
        if(typeof todo.title !== 'string' || todo.title.trim().length === 0){
            throw new Error('todo title filled incorectly')
        }
    }
    if(todo.description !== undefined){
        if(typeof todo.description !== 'string' || todo.description.trim().length === 0){
            throw new Error('todo description filled incorectly')
        }
    }
    if(todo.state !== undefined){
        if(!allowedStates.includes(todo.state)){
                throw new Error('todo status filled incorectly')
        }
    }
    EdTodo.title = todo.title ?? EdTodo.title;  //checks whether value is null or undefined
    EdTodo.description = todo.description ?? EdTodo.description;  //if value1 is not null or undefined use it.   value1 ?? value2
    EdTodo.state = todo.state ?? EdTodo.state;                    // else use value2
    EdTodo.updatedAt = new Date().toISOString();

    return EdTodo
}


export function DeleteTodo(id){
    const todo = todos.findIndex(todo => todo.id === id);   //findIndex returns array index 

    if (todo === -1) {  //-1 means not found
        throw new Error('todo not found');
    }

    const deleted = todos.splice(todo, 1);  //splice deletes at given index and number of elemnts given and return deleted items
    return deleted

}