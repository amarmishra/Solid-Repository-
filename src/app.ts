//import cors from 'cors'
//import { DataSource } from 'typeorm'
import express, { Application, Express } from 'express'
import path from 'path'
import IApp from './utils/interfaces/app.interface'
import Controller from './utils/interfaces/controller.interface'
import ErrorHandler from './middlewares/error.middleware'
import HttpException from './utils/exceptions'
import { connectDb as dbConnection } from './connect-db'

class App implements IApp {
    app: Application
    private databaseUp: boolean = true
    constructor(public port: number, controllers: Controller[]) {
        this.app = express();
        this.setMiddleWares();
        this.intializeControllers(controllers);
        this.setErrorHandler();
    }

    private async connectDb() {
        try {
            await dbConnection();
            this.databaseUp = true
            console.log('Database connected successfully')
        } catch (error) {
            console.log(error)
            throw new HttpException(500, 'Unable to connect to database')
        }


    }

    private setMiddleWares() {
        //this.app.use(cors());
        this.app.use(express.json())
    }

    private intializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use(controller.router)
        })
    }

    private setErrorHandler() {
        this.app.use(ErrorHandler);
    }

    async listen() {
        await this.connectDb();
        if (this.databaseUp) {
            this.app.listen(this.port, () => {
                console.log(`Application running at port ${this.port}`)
            })
            return
        }
        throw new HttpException(500, 'Database not connected')
    }

}

export default App