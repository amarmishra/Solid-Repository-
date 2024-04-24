class HttpException extends Error{
    constructor(public status: number,public message: string){
        super()
    }
}

export default HttpException