export const ERROR_MESSAGES = {
  BAD_REQUEST: "La petición ha fracazado, intenta nuevamente",
  PERMISSIONS_DENIED: "No posees los permisos para esta acción",
  DUPLICATE_DATA: "Existe un campo duplicado. Verifique y vuelva a intentarlo en: ",
  DATA_TOO_LONG: "Existe un dato que excede el máximo esperado",
  CLIENT_SERVER_ERROR: "El servidor no puede devolver una respuesta debido a un error del cliente",
  UNAUTHENTICATED: "No te encuentras autenticado por el sistema",
  WRONG_LOGIN_CREDENTIALS: "Las credenciales ingresadas son incorrectas",
  WRONG_LOGIN_EMAIL: "El email proporcionado es incorrecto o no existe",
  WRONG_LOGIN_PASSWORD: "La contraseña proporcionado es incorrecta",
  WRONG_CURRENT_PASSWORD: "La contraseña actual es inválida",
  MISSING_TOKEN: "Token no ha sido recibido o es invalido",
  CONSTRAINT_ON_DELETE: "El registro no puede ser eliminado. Primero debe eliminar los registros asociados a esta entidad",
  DELETE_NOT_EXIST: "El registro no existe, por favor actualiza tu página",
  INVALID_PASSWORD: "El campo 'contraseña' no cumple con los criterios establecidos",
  INVALID_DATE: "La fecha ingresada es menor a la actual, por favor asegurese de ingresar una fecha valida",
};

export const SUCCESS_MESSAGES = {
  TOKEN_VERIFIED: "El token ha sido verificado",
  STORED: "Registro guardado exitosamente",
  DELETED: "Registro eliminado exitosamente",
  UPDATED: "Datos actualizados correctamente",
};