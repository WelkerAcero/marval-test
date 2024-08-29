import { PRISMA_ERROR_TYPE, VALIDATION_TYPE } from './data-structure/structures';
import { ERROR_MESSAGES } from "./status-messages/messages";

export class PrismaErrorHandler {
    static error(data: PRISMA_ERROR_TYPE): VALIDATION_TYPE {
        let res: VALIDATION_TYPE = { error: '', valid: true }
        console.log(data);
        switch (data.code) {
            case "P2000":
                res = { error: `${ERROR_MESSAGES.DATA_TOO_LONG}`, valid: false };
                break;

            case "P2002":
                res = { error: `${ERROR_MESSAGES.DUPLICATE_DATA} ${this.fieldName(data.meta.target[0])}`, valid: false };
                break;

            case "P2003":
                res = { error: `${ERROR_MESSAGES.CONSTRAINT_ON_DELETE}`, valid: false };
                break;

            case "P2025":
                res = { error: `${ERROR_MESSAGES.DELETE_NOT_EXIST}`, valid: false };
                break;

            default:
                res = { error: `${data}`, valid: false };
                break;
        }
        return res;
    }


    private static fieldName(fieldName: string): string {
        let replaceFieldName: string = '';

        switch (fieldName) {
            case "nit":
                replaceFieldName = 'NIT';
                break;

            case "documentId":
                replaceFieldName = 'Documento de identidad';
                break;

            case "name":
                replaceFieldName = 'Nombre';
                break;

            case "lastname":
                replaceFieldName = 'Apellido';
                break;

            case "cellphone":
                replaceFieldName = 'Número de celular';
                break;

            case "email":
                replaceFieldName = 'Email';
                break;

            case "provider_type":
                replaceFieldName = 'Tipo de proveedor';
                break;

            case "person_type":
                replaceFieldName = 'Tipo de persona';
                break;

            case "status":
                replaceFieldName = 'Estado del proveedor';
                break;

            default:
                replaceFieldName = '';
                break;
        }
        return replaceFieldName;
    }

}