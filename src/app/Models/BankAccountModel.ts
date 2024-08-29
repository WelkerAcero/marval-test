import { Model } from "./Model";
export class BankAccountModel extends Model {
  private targetDbTable = this.prisma.bankAccounts;
  private allowedFields: string[] = ['bank_name', 'account_type', 'account_number'];
  private allowedRules: object = {
    "bank_name": { type: "string", max: 50 },
    "account_type": { type: "string", max: 9, mandatory: ['Ahorros', 'Corriente'] },
    "account_number": { type: "string", min: 11, max: 11 },
  };

  constructor() {
    super();
    this.targetTable();
    this.fieldsAllowed();
    this.setRules();
  }

  targetTable(): void {
    super.setTargetDbTable(this.targetDbTable);
  }

  fieldsAllowed(): void {
    super.setFields(this.allowedFields);
  }

  setRules(): void {
    super.setRules(this.allowedRules);
  }
}
