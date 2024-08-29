import { Request, Response } from "express";
import { ProviderModel } from "../../Models/ProviderModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../../../config/status-messages/messages";
import { JWT } from "../../helpers/JWT";
import { PROVIDER_TYPE } from "../../../../config/data-structure/structures";

export class ProviderController extends ProviderModel {

  getProviders = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }

      return res.status(200).json(await this.all());
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  getProvider = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }

      const ID: number = parseInt(req.params.id);
      return res.status(200).json(await this.where('id', ID).get());
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  getProvidersAndBankAccounts = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }
      return res.status(200).json(await this.with(['BankAccounts']).get());
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  getProviderAndBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-READ'))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }
      const ID: number = parseInt(req.params.id);
      return res.status(200).json(await this.with(['BankAccounts']).where('id', ID).get());
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  storeProviderAndBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-CREATE', this))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }

      const PROVIDER: PROVIDER_TYPE = req.body;
      const BANK_ACCOUNT = PROVIDER.BankAccounts;
      delete PROVIDER.BankAccounts;

      if (!BANK_ACCOUNT) return res.status(400).json(
        {
          error: {
            message: "La petición espera los datos bancarios asociados a este proveedor"
          }
        }
      )

      const SAVE = await this.interactiveStoreTransaction('Providers', PROVIDER, 'BankAccounts', BANK_ACCOUNT, "provider_id");
      if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

      return res.status(200).json(SAVE);
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  updateProviderAndBankAccount = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-UPDATE', this))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }

      const PROVIDER_ID: number = parseInt(req.params.provider_id);
      const BANK_ID: number = parseInt(req.params.bank_id);

      const PROVIDER: PROVIDER_TYPE = req.body;
      const BANK_ACCOUNT = PROVIDER.BankAccounts;
      delete PROVIDER.BankAccounts;

      if (!BANK_ACCOUNT) return res.status(400).json(
        {
          error: {
            message: "La petición espera los datos bancarios asociados a este proveedor"
          }
        }
      )

      const SAVE = await this.interactiveUpdateTransaction(
        'Providers', { id: PROVIDER_ID, ...PROVIDER }, 
        'BankAccounts', { id: BANK_ID, ...BANK_ACCOUNT }
      );

      if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });
      return res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED });
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  updateProviderStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'CHANGE-STATUS', this))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } });
      }
      
      const PROVIDER_ID: number = parseInt(req.params.id);
      const PROVIDER_STATUS = req.body;
      const SAVE = await this.update(PROVIDER_ID, PROVIDER_STATUS);

      if (SAVE.error) return res.status(409).json({ error: { message: `${SAVE.error}` } });

      return res.status(200).json({ message: SUCCESS_MESSAGES.UPDATED });
    } catch (error) {
      return res.status(500).json({ error: { message: ERROR_MESSAGES.CLIENT_SERVER_ERROR } });
    }
  }

  deleteProvider = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!(await JWT.validatePermission(req.headers.authorization, 'PROVIDER-DELETE', this))) {
        return res.status(401).json({ error: { message: ERROR_MESSAGES.PERMISSIONS_DENIED } })
      }

      const ID: number = parseInt(req.params.id);
      const DELETE = await this.delete(ID);

      if (DELETE.error) return res.status(409).json({ error: { message: DELETE.error } });

      return res.status(204).json({ message: SUCCESS_MESSAGES.DELETED });
    } catch (error: any) {
      return res.status(500).json({ error: { message: error } });
    }
  };

}
