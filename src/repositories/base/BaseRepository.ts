import {IRead} from '../interfaces/read.interface'
import {IWrite} from '../interfaces/write.interface'
import { Model,Document,Types, Query } from 'mongoose'

export abstract class BaseRepository<T extends Document> implements IRead<T>,IWrite<T>{
    constructor(private model: Model<any>){
    }

    create(item: T): Promise<T> {
        return this.model.create(item);
    }
    async update(id: string, item: T): Promise<T | null> {
         const updatedResult= await this.model.findOneAndUpdate({id:this.toObjectId(id)},item,{new:true})
         return updatedResult
    }
    async delete(id: string): Promise<boolean> {
        try{
            await  this.model.deleteOne({id:this.toObjectId(id)})
            return true
        }
        catch(err){
            return false
        }
       
    }
    find(item: Partial<T>): Promise<T[] | null> {
            console.log("Here in find works")
            return this.model.find()
        
        //return this.model.find({$where:JSON.stringify(item)})
    }
    findOne(id: string): Promise<T | null> {
        return this.model.findOne({id})
    }
    
    private toObjectId(id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(id)
    }
}