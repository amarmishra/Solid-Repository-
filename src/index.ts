import 'reflect-metadata'

import App from './app'
import PostController from './controllers/post'

const app=new App(3000,[new PostController()])

app.listen()