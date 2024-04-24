import { Request,Response,NextFunction } from "express";
import HttpException from '../utils/exceptions'
function ErrorHandler(err: HttpException | unknown,req: Request,res: Response,next:NextFunction){
    if(err instanceof HttpException){
        return res.status(err.status).json({message: err.message})
    }
    console.log(err)
    return res.status(500).json('Something went wrong')
}

export default ErrorHandler