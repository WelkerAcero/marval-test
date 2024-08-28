import { Model } from "./Model";
export class UserModel extends Model {
  private targetDbTable = this.prisma.users;
  private allowedFields: string[] = [];
  private allowedRules: object = {
    param1: { type: "string", max: 10, min: 8 },
    param2: { type: "string", max: 10, min: 8 },
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
