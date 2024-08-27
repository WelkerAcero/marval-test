import { PrismaClient } from '@prisma/client';
import { VALIDATION_TYPE, USER_TYPE } from '../../../config/data-structure/structures';
import { InputHandler } from '../../../config/input-handler/ValidateInputs';
import { PrismaErrorHandler } from '../../../config/PrismaErrorHandler';

const PRISMA: PrismaClient = new PrismaClient();

export class Model {
    private _whereCondition: any = {};
    private _withRelation: any = {};
    private _tableField: any = {};
    private fields: string[];
    private rules: object = {};
    private dbTable: any;

    protected prisma: PrismaClient = PRISMA
    protected relation: string[] | string = '';

    public user: USER_TYPE | undefined;

    constructor(user?: USER_TYPE) {
        this.dbTable = null;
        this.fields = [];
        this.setUser(user);
    }

    // Método para establecer el usuario de la instancia actual
    public setUser(user?: USER_TYPE): void {
        this.user = user;
    }

    // Método para obtener el usuario de la instancia actual
    public getUser(): USER_TYPE | undefined {
        return this.user;
    }

    protected setTargetDbTable<T>(targetDbTable: any): void {
        this.dbTable = null;
        this.dbTable = targetDbTable;
    }

    protected setFields(fields: string[]): void {
        this.fields = fields;
    }

    protected setRules(rules: object): void {
        this.rules = rules;
    }

    async saveUserChanges(
        user: USER_TYPE, action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
        module: string, ipAddress: string, userAgent: string,
        description?: string, changedData?: object, previousData?: object
    ): Promise<void> {

        const DATA_TO_STORE = {
            user_document_id: user.documentId,
            user_name: user.name,
            user_lastname: user.lastname,
            description,
            action,
            module,
            changedData,
            previousData,
            ipAddress,
            userAgent,
        }
        const CHANGES = await this.prisma.historyUserChanges.create({ data: DATA_TO_STORE });
        if (CHANGES) console.log('Los cambios del usuario han sido guardados:', CHANGES);
    }

    select(fields: string[] | string): Model {
        this._tableField = [];
        if (typeof fields !== 'string') {
            fields.forEach(element => {
                this._tableField = {
                    ...this._tableField,
                    [element]: true
                }
            });
        } else {
            this._tableField = { [fields]: true }
        }
        return this;
    }

    whereNot(columnName: string, value: string | number | boolean): Model {
        this._whereCondition = {};
        this._whereCondition = {
            NOT: { [columnName]: value }
        }
        return this;
    }

    where(columnName: string, value: string | number | boolean | Date, manualQuery?: object): Model {
        if (manualQuery) {
            this._whereCondition = manualQuery;
        } else {
            this._whereCondition = {};
            this._whereCondition = {
                ...this._whereCondition,
                [columnName]: value
            }
        }
        return this;
    }

    buildWhere(manualQuery: object): Model {
        this._whereCondition = {
            ...this._whereCondition,
            ...manualQuery
        };
        return this;
    }

    whereOr(columnName: string, value: string | number | boolean | Date): Model {
        this._whereCondition = {
            OR: [
                { ...this._whereCondition },
                { [columnName]: value },
            ]
        }
        return this;
    }

    protected with(tableRelation: string[] | any): Model {
        tableRelation.forEach((element: string) => {
            if (typeof element === 'string') {
                this._withRelation[element] = true;
            } else {
                Object.assign(this._withRelation, element)
            }
        });
        return this;
    }

    private async executeQuery(pageSize?: number, page: string = '1'): Promise<Model> {
        try {
            let totalValues: number = 0;
            const relation = Object.keys(this._withRelation).length > 0 ? this._withRelation : false;
            let options: any = {
                where: this._whereCondition,
                include: relation,
            };

            if (Object.values(this._tableField).length > 0) Object.assign(options, { select: this._tableField });

            if (pageSize !== undefined) {
                totalValues = this.dbTable.count();
                const currentPage: number = parseInt(page);
                options.take = pageSize;
                options.skip = (currentPage - 1) * pageSize;
            }

            this._whereCondition = {};
            this._withRelation = {};
            return await this.dbTable.findMany(options);

        } catch (error: any) {
            return error;
        }
    }

    async get<T>(): Promise<T[]> {
        const result: any = await this.executeQuery();
        // Asumiendo que `result` es un array de tipo `T`
        return result as T[];
    }


    async paginate(pageSize: number, page?: string | undefined): Promise<Model | any> {
        if (typeof page === 'undefined') page = '1';
        return await this.executeQuery(pageSize, page);
    }

    protected async create(commingData: object): Promise<any> {
        try {
            const VALIDATE_FIELDS: VALIDATION_TYPE = InputHandler.validateFields(commingData, this.fields);
            if (!VALIDATE_FIELDS.valid) return { error: `${VALIDATE_FIELDS.error}` }

            const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(commingData, this.rules);
            if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}` }

            return await this.dbTable.create({ data: commingData });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async update(id: number, newData: object) {
        try {
            const VALIDATE_FIELDS: VALIDATION_TYPE = InputHandler.validateFields(newData, this.fields);
            if (!VALIDATE_FIELDS.valid) return { error: `${VALIDATE_FIELDS.error}` }

            const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(newData, this.rules);
            if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}` }

            const result: any = await this.dbTable.update({
                where: {
                    id: id,
                },
                data: newData,
            });

            console.log('Datos actualizado:', result);
            return result;

        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async delete(id: number) {
        try {
            const DELETED = await this.dbTable.delete({ where: { id } });
            if (DELETED) {
                return DELETED;
            }
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async deleteMany(dataToDelete: object) {
        try {
            const DELETED = await this.dbTable.deleteMany({ where: dataToDelete, });
            if (DELETED) {
                return DELETED;
            }
        } catch (error: any) {
            console.log(error);
            return error;
        }
    }

    async importModelRules(targetTable: string): Promise<any> {
        try {
            if (targetTable.endsWith('ies')) {
                targetTable = targetTable.replace(/ies$/, "yModel");
            } else {
                targetTable = `${targetTable.slice(0, -1)}Model`;
            }
            const modulePath = `./${targetTable}`;

            // Importa el módulo de forma asíncrona
            const MODULE = await import(modulePath);
            const CLASS = MODULE[`${targetTable}`];

            // Crea una instancia de la clase
            let objInstance: any = new CLASS();
            const RULES: object = objInstance.allowedRules;
            objInstance = null;
            return RULES;

        } catch (error: any) {
            console.error("Error al importar el módulo:", error);
            return error;
        }
    }

    protected async validateRules(table: any, values: {}): Promise<VALIDATION_TYPE> {
        const RULES: object = await this.importModelRules(table.name.toString());
        const INPUT_VALIDATION: VALIDATION_TYPE = await InputHandler.validateInputs(values, RULES);
        if (!INPUT_VALIDATION.valid) return { error: `${INPUT_VALIDATION.error}`, valid: false };
        return { error: ``, valid: true };
    }

    private async validateRulesInSeveral(data: any[], tables: string[]): Promise<VALIDATION_TYPE> {
        let i: number = 0;
        let validation: VALIDATION_TYPE = { error: 'All is well', valid: true };
        do {
            for (const obj of Object.values(data)) {
                const DATA = obj;
                const DATA_STRUCTURE = DATA[tables[i]];

                if (Array.isArray(DATA_STRUCTURE)) {
                    for (let j = 0; j < DATA_STRUCTURE.length; j++) {
                        const VALIDATION_MODEL = await this.validateRules((PRISMA as any)[tables[i]], DATA_STRUCTURE[j]);
                        if (!VALIDATION_MODEL.valid) return validation = { error: `${VALIDATION_MODEL.error}`, valid: false };
                    }
                } else {
                    const VALIDATION_MODEL = await this.validateRules((PRISMA as any)[tables[i]], DATA_STRUCTURE);
                    if (!VALIDATION_MODEL.valid) return validation = { error: `${VALIDATION_MODEL.error}`, valid: false };
                }
            }
            i++;
        } while (i < tables.length && validation.valid);

        return validation;
    }


    /**
  * Función que recibe tablas como llaves y datos
  * @param {string} table1 nombre de la tabla 1 de la base de datos
  * @param {string} table2 nombre de la tabla 2 de la base de datos
  * @param {object} dataTable1 recibe los datos de la tabla 1 
  * @param {object} updateData recibe los datos de la tabla 2 que fueron actualizados en el proceso
  * @param {string} updateField Recibe el nombre de la columna con el cual actualizaremos los datos de la tabla 2
  * @returns {object} devuelve el registro de la transacción y la información resultante de la cuenta del usuario
   */
    protected async storeAndUpdateTransaction(table1: string, dataTable1: object, table2: string, updateData: object, updateField: string): Promise<any> {
        try {

            // Validar si las tablas existen en el cliente de Prisma
            if (!PRISMA.hasOwnProperty(table1) || !PRISMA.hasOwnProperty(table2)) {
                return { error: 'One or both of the provided table names are not valid.', valid: false };
            }

            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[table1], dataTable1);
            if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

            const VALIDATION_MODEL2 = await this.validateRules((PRISMA as any)[table2], updateData);
            if (!VALIDATION_MODEL2.valid) return { error: `${VALIDATION_MODEL2.error}` }

            return await PRISMA.$transaction(async (tx: any) => {
                const TABLE_MODEL_1 = (tx as any)[table1];
                const TABLE_MODEL_2 = (tx as any)[table2];

                const STORE = await TABLE_MODEL_1.create({ data: dataTable1 });
                const UPDATE = await TABLE_MODEL_2.update({
                    where: { [updateField]: (updateData as any)[updateField] },
                    data: updateData
                });

                return {
                    [table1]: STORE,
                    [table2]: UPDATE
                };
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    /**
     * Función que recibe tablas como llaves y datos
     * @param {string} table1 nombre de la tabla1 de DB 
     * @param {string} table2 nombre de la tabla2 de DB
     * @param {object} dataTable1 recibe los datos de la tabla1 
     * @param {object} dataTable2 recibe los datos de la tabla2
     * @param {string} foreignName Recibe el nombre de la columna que es foranea en la tabla2 que depende de la creación de la tabla1
     * @returns {object} devuelve la relación con la tabla1 que tiene el modelo donde se esta usando la función
      */
    protected async interactiveStoreTransaction(table1: string, dataTable1: object, table2: string, dataTable2: object, foreignName: string): Promise<any> {
        try {
            // table1 and table2 must have the data table name, example: Doctors, Users
            if (!PRISMA.hasOwnProperty(table1) || !PRISMA.hasOwnProperty(table2)) {
                return { error: 'One or both of the provided table names are not valid.', valid: false }
            }
            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[table1], dataTable1);
            if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

            const VALIDATION_MODEL2 = await this.validateRules((PRISMA as any)[table2], dataTable2);
            if (!VALIDATION_MODEL2.valid) return { error: `${VALIDATION_MODEL2.error}` }

            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                const TABLE_MODEL_1 = (tx as any)[table1];
                const TABLE_MODEL_2 = (tx as any)[table2];

                const STORE_TABLE_1 = await TABLE_MODEL_1.create({ data: dataTable1 });
                await TABLE_MODEL_2.create({ data: { ...dataTable2, [foreignName]: STORE_TABLE_1.id } });

                return await this.with([table1]).where('id', STORE_TABLE_1.id).get();
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async interactiveUpdateTransaction(table1: string, dataTable1: any, table2: string, dataTable2: any): Promise<any> {
        try {
            // table1 and table2 must have the data table name, example: Doctors, Users
            if (!PRISMA.hasOwnProperty(table1) || !PRISMA.hasOwnProperty(table2)) {
                return { error: 'One or both of the provided table names are not valid.', valid: false }
            }
            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[table1], dataTable1);
            if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

            const VALIDATION_MODEL2 = await this.validateRules((PRISMA as any)[table2], dataTable2);
            if (!VALIDATION_MODEL2.valid) return { error: `${VALIDATION_MODEL2.error}` }

            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                const TABLE_MODEL_1 = (tx as any)[table1];
                const TABLE_MODEL_2 = (tx as any)[table2];
                const UPDATE_TABLE_1 = await TABLE_MODEL_1.update({ where: { id: dataTable1.id }, data: dataTable1 });
                const UPDATE_TABLE_2 = await TABLE_MODEL_2.update({ where: { id: dataTable2.id }, data: dataTable2 });

                return await this.with([table1]).where('id', UPDATE_TABLE_1.id).get();
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async updateManyTransaction(options: { tables: string[], update: any[] }): Promise<any> {
        try {
            // validar que las tablas estan correctamente escritas y existen
            const TABLES: string[] = options.tables;
            const PROPERTIES_NAME: string[] = Object.keys(options.update);

            for (let i = 0; i < TABLES.length; i++) {
                const TABLE = TABLES[i];
                if (!PRISMA.hasOwnProperty(TABLE) || !PRISMA.hasOwnProperty(TABLE)) {
                    return { error: 'One or both of the provided table names are not valid.', valid: false }
                }
            }

            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            for (let i = 0; i < options.update.length; i++) {
                const TABLE: string = PROPERTIES_NAME[i];
                const DATA = options.update[i][TABLE];

                if (Array.isArray(DATA) && DATA.length > 0) {
                    for (let j = 0; j < DATA.length; j++) {
                        const DATA_IN_ARRAY = DATA[j];
                        const VALIDATION_MODEL = await this.validateRules((PRISMA as any)[TABLE], DATA_IN_ARRAY);
                        if (!VALIDATION_MODEL.valid) return { error: `${VALIDATION_MODEL.error}` }
                    }
                } else {
                    if (!DATA.id) continue;
                    const VALIDATION_MODEL = await this.validateRules((PRISMA as any)[TABLE], DATA);
                    if (!VALIDATION_MODEL.valid) return { error: `${VALIDATION_MODEL.error}` }
                }
            }

            let result: any[] = [];
            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                for (let i = 0; i < options.update.length; i++) {
                    const TABLE: string = PROPERTIES_NAME[i];
                    const TABLE_MODEL = (tx as any)[TABLE];
                    const DATA = options.update[i];

                    if (Array.isArray(DATA) && DATA.length > 0) {
                        for (let j = 0; j < DATA.length; j++) {
                            const DATA_IN_ARRAY = DATA[j];
                            const UPDATE_TABLE = await TABLE_MODEL.update({ where: { id: DATA_IN_ARRAY.id }, data: DATA_IN_ARRAY });
                            result.push(UPDATE_TABLE);
                        }
                    }

                    if (!Array.isArray(DATA) && DATA.id) {
                        const UPDATE_TABLE = await TABLE_MODEL.update({ where: { id: DATA.id }, data: DATA });
                        result.push(UPDATE_TABLE);
                    }
                }

                return result;
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async simpleStoreTransaction(tableName: string, data: object, foreignTable: string, foreignId: number): Promise<any> {
        try {
            // table1 and table2 must have the data table name, example: Doctors, Users
            if (!PRISMA.hasOwnProperty(tableName)) {
                return { error: 'One or both of the provided table names are not valid.', valid: false }
            }
            // BEFORE ENTER IN THE TRANSACTION MAKE VALIDATION
            const VALIDATION_MODEL1 = await this.validateRules((PRISMA as any)[tableName], data);
            if (!VALIDATION_MODEL1.valid) return { error: `${VALIDATION_MODEL1.error}` }

            return await PRISMA.$transaction(async (tx: any) => {
                // Acceder a los modelos de Prisma dinámicamente
                const TABLE_MODEL = (tx as any)[tableName];
                const STORED_TABLE = await TABLE_MODEL.create(
                    {
                        data: {
                            ...data,
                            [foreignTable]: {
                                connect: { id: foreignId } // Pasar el objeto completo de MedicalHistories
                            }
                        }
                    });
                return STORED_TABLE;
            });
        } catch (error: any) {
            return PrismaErrorHandler.error(error);
        }
    }

    protected async all<T>(): Promise<T[]> {
        try {
            return await this.dbTable.findMany();
        } catch (error: any) {
            console.error(error);
            return error;
        }
    }

}
