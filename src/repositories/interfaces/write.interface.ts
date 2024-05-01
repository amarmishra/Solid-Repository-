export interface IWrite<T>{
    create(item:T):Promise<T>,
    update(id:string,item:Partial<T>):Promise<T | null>,
    delete(id:string):Promise<boolean>
}