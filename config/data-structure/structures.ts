export type VALIDATION_TYPE = {
    error: string,
    valid: boolean;
}

export type RULE_TYPE = {
    type: string,
    max?: number,
    min?: number,
    mandatory?: string[],
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

// ================ ROLES ==========================
export type ROLES_TYPE = {
    id: number,
    rol_name: string,
    RolesPermissions?: ROLES_PERMISSIONS_TYPE[],
    createdAt?: Date,
    updatedAt?: Date
}

export type ROLES_PERMISSIONS_TYPE = {
    id?: number,
    role_id: number,
    permission_id: number
    Permissions?: PERMISSIONS_TYPE
}

export type PERMISSIONS_TYPE = {
    id: number,
    type: string,
}
// ====================================================

export type USER_TYPE = {
    iat?: number
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
    Roles?: ROLES_TYPE,
    // FIN RELACIONES
    createdAt?: Date,
    updatedAt?: Date,
}

export type PROVIDER_TYPE = {
    id?: number,
    nit: string,
    documentId: string,
    name: string,
    lastname: string,
    provider_type: string, // Nacional | Internacional
    person_type: string,   // Natural | Juridico
    Partners: PARTNERS_TYPE[],
    BankAccounts?: BANK_ACCOUNT_TYPE,
    createdAt?: Date,
    updatedAt?: Date,
}

export type BANK_ACCOUNT_TYPE = {
    id?: number,
    bank_name: string,
    account_type: string,
    account_number: string,
    provider_id: number,
    createdAt?: Date,
    updatedAt?: Date,
}

export type PARTNERS_TYPE = {
    id: number,
    documentId: string,
    provider_id: number,
    createdAt?: Date,
    updatedAt?: Date,
}

