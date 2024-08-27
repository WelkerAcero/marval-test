import { DateCalculation } from '../../app/helpers/DateCalculation';
import { RULE_TYPE, VALIDATION_TYPE } from '../data-structure/structures';

export class InputHandler {

    static async validateInputs(data: any, validation?: any): Promise<VALIDATION_TYPE> {

        if (typeof validation == 'object') {
            for (const key in data) {
                const RULE: RULE_TYPE = validation[key];
                /* Validación de campos para pacientes y sirve para otros que contengan el mismo nombre de parámetro */
                if (key == 'documentId') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Cédula" debe estar entre ${RULE.min} a ${RULE.max} números`), valid: false };
                if (key == 'name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'lastname') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Apellido", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'email') if (!this.email(data[key], RULE)) return { error: this.message('Email contiene caracteres inválidos'), valid: false };
                if (key == 'cellphone') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Celular" debe ser igual a ${RULE.min}`), valid: false };

                /* Validación de campos para doctor */
                if (key == 'professionalId') if (!this.stringWithNumbers(data[key], RULE)) return { error: this.message(`"Tarjeta profesional" no debe contener caracteres inválidos y debe tener una longitud entre ${RULE.min} y ${RULE.max} `), valid: false };

                /* Validación de campos para MedicalService */
                if (key == 'service') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre de la especialidad" no debe contener caracteres inválidos y debe tener una longitud máxima entre ${RULE.min} a ${RULE.max}`), valid: false }

                /* Validación historial médico */
                if (key == 'patient_document_id') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Número de identificación del paciente" debe estar entre ${RULE.min} a ${RULE.max} números`), valid: false };
                if (key == 'patient_name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre del paciente", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'patient_lastname') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Apellido del paciente", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'patient_cellphone') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Celular del paciente" debe ser igual a ${RULE.min}`), valid: false };
                if (key == 'patient_email') if (!this.email(data[key], RULE)) return { error: this.message('Email del paciente contiene caracteres inválidos'), valid: false };
                if (key == 'appointment_date') if (!this.dateTime(data[key], RULE)) return { error: this.message(`Fecha, verifique que el dato insertato sea del mismo tipo.`), valid: false };
                if (key == 'doctor_document_id') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Número de identificación del doctor" debe estar entre ${RULE.min} y ${RULE.max} dígitos`), valid: false };
                if (key == 'doctor_professional_id') if (!this.stringWithNumbers(data[key], RULE)) return { error: this.message(`"Id profesional" no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'doctor_name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre del doctor" no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'doctor_lastname') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Apellido del doctor" no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
                if (key == 'doctor_cellphone') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Celular del doctor" debe ser igual a ${RULE.min}`), valid: false };
                if (key == 'doctor_email') if (!this.email(data[key], RULE)) return { error: this.message('Email del doctor contiene caracteres inválidos'), valid: false };
                if (key == 'service_name') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Nombre del servicio" no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };

                /* VALIDATE A BOOLEAN_ */
                if (key == 'attend_appointment') if (!this.booleans(data[key], RULE)) return { error: this.message(`de 'asistencia de cita', vuelva a intentarlo`), valid: false };

                // /* Validación para la creación fechas */
                // if (key == 'hour_id' || key == 'day_num' || key == 'month_id' || key == 'year_id') {
                //     if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Hora", verifique el tipo de dato.`), valid: false };
                //     if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Día" verifique el tipo de dato.`), valid: false };
                //     if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Mes" verifique el tipo de dato.`), valid: false };
                //     if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Año" verifique el tipo de dato.`), valid: false };
                    
                //     const VALIDATE_DATE = await DateCalculation.validateDate(data);
                //     if (!VALIDATE_DATE.valid) return { error: this.message(`"Fecha", ${VALIDATE_DATE.error}"`), valid: false }
                // }

                /* Medical History */
                if (key == 'medical_history_code') if (!this.stringWithNumbers(data[key], RULE)) return { error: this.message(`"Código" de la historía clínica tiene un problema`), valid: false };
                if (key == 'allergy') if (!this.booleans(data[key], RULE)) return { error: this.message(`"Alergia" tiene un problema`), valid: false };
                if (key == 'allergyDetail') if (!this.noSpecialSimbols(data[key], RULE)) return { error: this.message(`"Detalles de la alergia" tiene un problema, vuelve a intentarlo`), valid: false };
                if (key == 'observation') if (!this.noSpecialSimbols(data[key], RULE)) return { error: this.message(`"Observación" tiene un problema, vuelve a intentarlo"`), valid: false };
                if (key == 'diagnosis') if (!this.noSpecialSimbols(data[key], RULE)) return { error: this.message(`"Diagnóstico" tiene un problema, vuelve a intentarlo`), valid: false };
                if (key == 'presentation') if (!this.letterString(data[key], RULE)) return { error: this.message(`"Presentación del médicamento" tiene un problema, vuelve a intentarlo`), valid: false };
                if (key == 'quantity') if (!this.stringWithNumbers(data[key], RULE)) return { error: this.message(`"Cantidad" tiene un problema en la sección de medicina, vuelve a intentarlo`), valid: false };
                if (key == 'frequency') if (!this.noSpecialSimbols(data[key], RULE)) return { error: this.message(`"Frecuencia" en la sección de medicina tiene un problema, vuelve a intentarlo`), valid: false };
                if (key == 'instruction') if (!this.noSpecialSimbols(data[key], RULE)) return { error: this.message(`"Instrucción" en la sección de medicina tiene un problema, vuelve a intentarlo`), valid: false };

                /* Validación para los signos vitales */
                if (key == 'bloodPressure') if (!this.bloodPressure(data[key], RULE)) return { error: this.message(`"Presión arterial" verifique y vuelva a intentarlo.`), valid: false };
                if (key == 'heartRate') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Frecuencia cardíaca" verifique y vuelva a intentarlo.`), valid: false };
                if (key == 'breathingFrecuency') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Frecuencia respiratoria" verifique y vuelva a intentarlo`), valid: false };
                if (key == 'temperature') if (!this.onlyDecimalNumbers(data[key], RULE)) return { error: this.message(`"Temperatura" verifique y vuelva a intentarlo.`), valid: false };
                if (key == 'oxygenSaturation') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Saturación de oxígeno" verifique y vuelva a intentarlo.`), valid: false };
                if (key == 'weight') if (!this.onlyDecimalNumbers(data[key], RULE)) return { error: this.message(`"Peso" verifique y vuelva a intentarlo.`), valid: false };
                if (key == 'height') if (!this.onlyDecimalNumbers(data[key], RULE)) return { error: this.message(`"Altura" verifique y vuelva a intentarlo.`), valid: false };
                if (key == 'bloodGlucose') if (!this.onlyNumbers(data[key], RULE)) return { error: this.message(`"Glucosa en sangre" verifique y vuelva a intentarlo. "Índice de masa corporal" verifique y vuelva a intentarlo.`), valid: false };

                /* Validación para VaccineFollowUps */
                if (key == 'vaccineName') if (!this.noSpecialSimbols(data[key], RULE)) return { error: this.message(`"Nombre de vacuna", no debe contener caracteres inválidos y debe tener una longitud máxima de ${RULE.max}`), valid: false };
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
        field.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const regex = /^[a-zA-ZñÑ]+(?:\s[a-zA-ZñÑ]+)*$/g
        return regex.test(field);
    }

    static message(field: string): string {
        return `Error en el campo: ${field}`
    }
}