import { Request, Response } from "express";
import { Encrypt } from "../../helpers/ENCRYPT";
import { UserModel } from "../../Models/UserModel";
import { USER_TYPE } from "../../../../config/data-structure/structures";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../../config/status-messages/messages";
import { PasswordHandler } from "../../../../config/input-handler/PasswordHandler";
import { DataOrganizer } from "../../helpers/DataOrganizer";
import { JWT } from "../../helpers/JWT";

export class UserController extends UserModel {

  storeUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const PASSWORD = req.body.password;
      if (!PasswordHandler.isPasswordValid(PASSWORD)) return res.status(401).json({ error: { message: ERROR_MESSAGES.INVALID_PASSWORD } });

      const ENCRYPTED_PASSWORD: string = Encrypt.encryptPassword(PASSWORD);
      req.body.password = ENCRYPTED_PASSWORD;
      req.body.email.replace(/\s+/g, '');

      const DATA: USER_TYPE = req.body;
      const SAVE = await this.create(DATA);

      if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });
      return res.status(201).json(SAVE);

    } catch (error: any) {
      console.log(error);
      return res.status(400).json(error);
    }
  }

  private verifyEmail = async (email: string): Promise<USER_TYPE> => {
    const USER = Object.values(await this.with([{
      Roles: {
        select: {
          id: true,
          rol_name: true,
          RolesPermissions: {
            select: {
              id: true, 
              Permissions: true
            }
          }
        }
      }
    }]).where('email', email).get<USER_TYPE>())[0];
    return USER;
  }

  authenticateAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
      const EMAIL: string = req.body.email.replace(/\s+/g, '');
      const ADMIN: USER_TYPE = await this.verifyEmail(EMAIL);

      if (!ADMIN) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.WRONG_LOGIN_CREDENTIALS } });
      }
      if (ADMIN.password !== Encrypt.encryptPassword(req.body.password)) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.WRONG_LOGIN_CREDENTIALS } });
      }

      await DataOrganizer.deleteProp([ADMIN], ['password', 'remember_token']);
      const TOKEN = await JWT.createToken(ADMIN);

      return res.status(200).json(
        {
          authenticate: true,
          message: 'Successful login',
          token: TOKEN,
          expiresIn: 3600
        });
    } catch (error) {
      console.error(error);
      return res.status(409).json({ error: { message: ERROR_MESSAGES.MISSING_TOKEN } });
    }
  }

}
