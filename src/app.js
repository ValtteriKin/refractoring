import express from 'express'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import todosRouter from './routes/todos.js'
// add yaml code here
//app.use(/doc) /doc localhost:3000/doc address for webpage
const app = express()

// support for json
app.use(express.json())

// define handlers for various routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/todos', todosRouter)

// export the app object to server.js where we referred to this
export default app
