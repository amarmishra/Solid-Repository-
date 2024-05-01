export interface IRead<T>{
    find(item:Partial<T>): Promise<T[] | null>,
    findOne(id: string): Promise<T | null>
}