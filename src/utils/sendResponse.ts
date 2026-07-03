import { Response } from "express";

type TMeta = {
    page?: number;
    limit?: number;
    total?: number;
}


type TPayload<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: TMeta;
    error?: any;

}



const sendResponse = <T> (res:Response, data : TPayload<T>  ) =>{

        res.status(data.statusCode).json({
            success: data.success,
            message: data.message,
            data: data.data,
            meta: data.meta,
            error: data.error
        });

}


export default sendResponse;