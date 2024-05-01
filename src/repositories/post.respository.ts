import {BaseRepository} from './base/BaseRepository'
import PostModel, { IPost } from '../entities/post'
export class PostRepository extends BaseRepository<IPost>{
    constructor(){
        super(PostModel)
    }
}