import { RULE_TYPE, VALIDATION_TYPE } from '../data-structure/structures';

export class InputHandler {

    static async validateInputs(data: any, validation?: any): Promise<VALIDATION_TYPE> {

        if (typeof validation == 'object') {
            for (const key in data) {
                const RULE: RULE_TYPE = validation[key];
                /* Validación de campos para todas las entradas con este nombre de propiedades */
                if (key == 'nit') if (!this.numbersAndHyphen(data[key], RULE)) return { error: this.message(`"Nit" debe estar entre ${RULE.min} a ${RULE.max} números y terminar con guión + número *******-*`), valid: false };
                if (key == 'documentId') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Cédula" debe estar entre ${RULE.min} a ${RULE.max} números`), valid: false };
                if (key == 'name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre", no debe contener caracteres inválidos como acentos o simbolos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'lastname') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Apellido", no debe contener caracteres inválidos como acentos o simbolos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'provider_type') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Tipo de proveedor" no debe contener caracteres inválidos como simbolos u otros y debe tener una longitud entre ${RULE.min} a ${RULE.max} y solo tener uno de estos valores: ${RULE.mandatory}`), valid: false };
                if (key == 'person_type') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Tipo de persona" no debe contener caracteres inválidos como simbolos y debe tener una longitud entre ${RULE.min} a ${RULE.max} y solo tener uno de estos valores: ${RULE.mandatory}`), valid: false };
                if (key == 'status') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Estado" no debe contener caracteres inválidos como simbolos y debe tener uno de estos valores: ${RULE.mandatory}`), valid: false };

                if (key == 'email') if (!this.email(data[key], RULE)) return { error: this.message('Email contiene caracteres inválidos'), valid: false };
                if (key == 'cellphone') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Celular" debe ser igual a ${RULE.min}`), valid: false };
                if (key == 'account_number') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Número de cuenta" debe tener una longitud de ${RULE.max} dígitos y solo acepta números`), valid: false };
                
                if (key == 'bank_name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre de banco" no debe contener caracteres inválidos como simbolos y debe tener una longitud entre ${RULE.min} a ${RULE.max}`), valid: false };
                if (key == 'account_type') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Tipo de cuenta" no debe contener caracteres inválidos como simbolos y debe tener uno de estos valores: ${RULE.mandatory}`), valid: false };
                if (key == 'account_number') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Número de cuenta" solo acepta números y debe tener una longitud de ${RULE.max}`), valid: false };
            }
        }
        return { error: '', valid: true };
    }

    static validateFields(data: object, allowedFields: string[]): VALIDATION_TYPE {
        for (let property in data) {
            if (!allowedFields.includes(property)) {
                const RESPONSE = { error: `El campo: "${property}" no está listado como parámetro permitido`, valid: false }
                return RESPONSE;
            }
        }
        return { error: '', valid: true };
    }

    //////////////////////////// VALUES VALIDATION ////////////////////////////////////////////
    static email(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (!(rule.type == typeof field)) return false;
        const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return regex.test(field);
    }

    static bloodPressure(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (!(rule.type == typeof field)) return false;
        const regex = /^\d{1,3}\/\d{1,3}$/
        return regex.test(field);
    }

    static booleans(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (!(rule.type == typeof field)) return false;
        return true
    }

    static stringWithNumbers(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[a-zA-ZÑñ0-9]+$/g;
        return regex.test(field);
    }

    static noSpecialSimbols(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[a-zA-ZÑñÁÉÍÓÚáéíóúÜü0-9\s.,+-¿?%¡!():;\/*'"#]+$/gi
        return regex.test(field);
    }


    static numbersAndHyphen(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^\d+-\d$/
        return regex.test(field);
    }

    static onlyNumbers(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        const regex = /^[0-9]+$/g;
        return regex.test(field);
    }

    static onlyDecimalNumbers(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min && field.length < rule.min) return false;
        if (rule.max && field.length > rule.max) return false;

        // Expresión regular para permitir números decimales
        const regex = /^\d*\.?\d+$/;
        return regex.test(field);
    }

    static dateTime(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        return true;
    }

    static letterString(field: string, rule: RULE_TYPE): boolean {
        if (rule.default && rule.default == 'empty') return true;
        if (typeof (field) !== rule.type) return false;
        if (rule.min) if (field.length < rule.min) return false;
        if (rule.max) if (field.length > rule.max) return false;
        if (rule.mandatory && rule.mandatory.length > 0) {
            if (!rule.mandatory.includes(field)) return false;
        }
        field.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const regex = /^[a-zA-ZñÑ]+(?:\s[a-zA-ZñÑ]+)*$/g
        return regex.test(field);
    }

    static message(field: string): string {
        return `Error en el campo: ${field}`
    }
}