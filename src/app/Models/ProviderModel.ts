import { Model } from "./Model";

export class ProviderModel extends Model {
  private targetDbTable = this.prisma.providers;
  private allowedFields: string[] = ['id', 'nit', 'documentId', 'name', 'lastname', 'provider_type', 'person_type', 'status'];
  private allowedRules: object = {
    'nit': { type: "string", max: 12, min: 6 },
    'documentId': { type: "string", max: 10, min: 6 },
    'name': { type: "string", max: 50 },
    'lastname': { type: "string", max: 50 },
    'provider_type': { type: "string", max: 12, min: 8, mandatory: ['Nacional', 'Internacional'] },
    'person_type': { type: "string", min: 7, max: 8, mandatory: ['Natural', 'Juridica'] },
    'status': { type: "string", mandatory: ['Aprobado', 'Rechazado', 'Pendiente'] },
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
