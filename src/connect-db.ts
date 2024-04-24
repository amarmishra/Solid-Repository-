import { DataSource } from "typeorm";
import path from 'path'

export const AppDataSource =
    new DataSource({
        type: "postgres",
        host: "dpg-coko4egl5elc73ddjsv0-a",
        port: 5432,
        username: 'amarmishra',
        password: "SDZd6eEuTWIHXAc7ebwdJk36nIXOyhl6",
        database: "bitespeed_db_0xim",
        entities: [path.join(__dirname, './models/*.{ts,js}')],
        ssl: true,
        logging: true,
        synchronize: true
    })
export async function connectDb() {
    AppDataSource.initialize()
}





