import express from 'express'
import cookieParser from 'cookie-parser'
import { verifyToken } from './middleware/verifytoken.js'
import { loginLimiter, apiLimiter } from './middleware/rate-limiter.js'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import todosRouter from './routes/todos.js'
// add yaml code here
//app.use(/doc) /doc localhost:3000/doc address for webpage
const app = express()

// support for json
app.use(express.json())
app.use(cookieParser())

const swaggerDocument = YAML.load('./openapi/api.yaml');
const swaggerOptions = {};
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// define handlers for various routes
app.use('/', indexRouter)
app.use('/auth', loginLimiter, authRouter)
app.use('/users', verifyToken, apiLimiter, usersRouter)
app.use('/todos', verifyToken, apiLimiter, todosRouter)

// export the app object to server.js where we referred to this
export default app
