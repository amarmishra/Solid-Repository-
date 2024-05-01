import { IPost } from "../entities/post";
import { PostRepository } from "../repositories/post.respository";
class PostService {
    postRepo: PostRepository
    constructor(repository:PostRepository){
        this.postRepo=repository
    }
    async getAll(){
       return this.postRepo.find(<IPost>{})
    }

    async createPost(post:IPost){
        return this.postRepo.create(post)
    }

}

export default new PostService(new PostRepository())