import { ROLES_PERMISSIONS_TYPE, USER_TYPE } from '../../../config/data-structure/structures';
import { Model } from '../Models/Model';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

export class JWT {
    private static secretKey: string = process.env.JWT_SECRET || '';

    static async createToken(payload: string | object): Promise<any> {
        return jwt.sign(payload, this.secretKey, { algorithm: 'RS256' });
    }

    static async decodeToken(token: string | undefined): Promise<any> {
        if (token) return jwt.verify(token.replace('Bearer ', ''), this.secretKey);
    }

    static async validatePermission(authorizationToken: string | undefined, permissionNeeded: string | string[], model?: Model): Promise<boolean> {
        if (!(authorizationToken) || !(permissionNeeded)) return false;

        let permissions: string[] = [];
        const USER: USER_TYPE = await JWT.decodeToken(authorizationToken);
        if (!USER) return false;

        if(model) model.setUser(USER);  // Establecer el usuario en la instancia de Model

        /* Recorrer y extraer todo los permisos y compararlo con el que necesita */
        USER.Roles?.RolesPermissions!.forEach((obj: ROLES_PERMISSIONS_TYPE) => {
            permissions.push(obj.Permissions!.type);
        });

        let validationRes: boolean = true;
        if (typeof (permissionNeeded) === 'string') if (!permissions.includes(permissionNeeded)) validationRes = false;
        if (Array.isArray(permissionNeeded)) permissionNeeded.forEach(permission => { if (!permissions.includes(permission)) validationRes = false; });

        return validationRes;
    }
}