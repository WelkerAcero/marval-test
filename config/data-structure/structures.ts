export type VALIDATION_TYPE = {
    error: string,
    valid: boolean;
}

export type RULE_TYPE = {
    type: string,
    max?: number,
    min?: number,
    default?: null
}

export type PRISMA_ERROR_TYPE = {
    code: string,
    clientVersion: string,
    meta: { target: string[] }
}

export type MULTER_FILE_TYPE = {
    buffer?: Buffer;
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    destination?: string;
    filename?: string;
    path?: string;
    size?: number;
};

export type FILES_TYPE = {
    [fieldname: string]: MULTER_FILE_TYPE[];
};

export type USER_TYPE = {
    id: number,
    documentType: string,
    documentId: string,
    name: string,
    lastname: string,
    cellphone: string,
    email: string,
    password: string,
    role_id: number,
    remember_token?: string | null,
    /* AQUí RELACIONES */

    // FIN RELACIONES
    createdAt?: Date,
    updatedAt?: Date,
    iat?: number
}