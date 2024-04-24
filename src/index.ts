import 'reflect-metadata'

import App from './app'
import IdentityController from './controllers/indentity'

const app=new App(3000,[new IdentityController()])

app.listen()