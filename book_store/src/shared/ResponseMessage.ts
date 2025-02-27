export class ResponseMessage{
    result: {};
    statusCode: number;
    errors: any[]
    public constructor(result: {}, statusCode: number, errors: any[]){
        this.result=result;
        this.statusCode = statusCode;
        this.errors=errors;
    }
}