import Controller from "../utils/interfaces/controller.interface";
import HttpError from "../utils/exceptions";
import { Router,Request,Response,NextFunction } from "express";
import PostService from "../services/post.service";
import { IPost } from "../entities/post";
class PostController implements Controller{
    path= '/posts';
    router= Router();

    constructor(){
        this.initiateRoutes()
    }

    private initiateRoutes(){
        this.router.post(this.path,this.create);
        this.router.get(this.path,this.getAll);
    }

    private async create(req:Request,res:Response,next:NextFunction):Promise<Response| void>{
        try{
            const {title,description}=req.body;
            const post=await PostService.createPost(<IPost>{title,description})

            return res.json({...post})
        }
        catch(err){
            console.log(err)
            next(new HttpError(500, 'Erro while creating post'));
        }
        
    }

    private async getAll(req:Request,res:Response,next:NextFunction):Promise<Response| void>{
        try{
            const post=await PostService.getAll()
            return res.json({...post})
        }
        catch(err){
            console.log(err)
            next(new HttpError(500, 'Erro while fetching post'));
        }
        
    }
}

export default PostController