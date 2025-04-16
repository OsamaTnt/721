


export class AppResponse {
    status: string;
    code: number;
    message: string;
    data: any;

    constructor(partial?: Partial<AppResponse>) {
      Object.assign(this, partial);
    }

};

