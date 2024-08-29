import { Router } from "express";
import { ProviderController } from "../../app/Http/Controllers/ProviderController";

const CONTROLLER = new ProviderController();
const ROUTER = Router();

ROUTER.get('/get/providers', CONTROLLER.getProviders);
ROUTER.get('/get/provider/:id', CONTROLLER.getProvider);
ROUTER.get('/get/providers-and-banks', CONTROLLER.getProvidersAndBankAccounts);
ROUTER.get('/get/provider-and-bank/:id', CONTROLLER.getProviderAndBankAccount);

ROUTER.post('/store/provider-and-bank-account', CONTROLLER.storeProviderAndBankAccount);
ROUTER.put('/update/provider-and-bank-account/:provider_id/:bank_id', CONTROLLER.updateProviderAndBankAccount);
ROUTER.put('/update/provider-status/:id', CONTROLLER.updateProviderStatus);

ROUTER.delete('/delete/provider/:id', CONTROLLER.deleteProvider);

export default ROUTER;
