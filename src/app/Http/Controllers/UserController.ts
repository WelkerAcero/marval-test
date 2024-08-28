import { Request, Response } from "express";
import { UserModel } from "../../Models/UserModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../../config/status-messages/messages";
import { JWT } from "../../helpers/JWT";

export class UserController extends UserModel { }
