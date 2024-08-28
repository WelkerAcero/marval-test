-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('Nacional', 'Internacional');

-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('Natural', 'Juridica');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('Aprobado', 'Rechazado', 'Pendiente');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "documentType" VARCHAR(25) NOT NULL,
    "documentId" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50),
    "cellphone" VARCHAR(10) NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(100),
    "remember_token" VARCHAR(100),
    "role_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "rol_name" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(40) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolesPermissions" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolesPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Providers" (
    "id" SERIAL NOT NULL,
    "nit" VARCHAR(12) NOT NULL,
    "documentId" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "provider_type" "ProviderType" NOT NULL,
    "person_type" "PersonType" NOT NULL,
    "status" "ProviderStatus" NOT NULL DEFAULT 'Pendiente',
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partners" (
    "id" SERIAL NOT NULL,
    "documentId" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccounts" (
    "id" SERIAL NOT NULL,
    "account_number" VARCHAR(11) NOT NULL,
    "available_amount" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_documentId_key" ON "Users"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_cellphone_key" ON "Users"("cellphone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_remember_token_key" ON "Users"("remember_token");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_rol_name_key" ON "Roles"("rol_name");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_type_key" ON "Permissions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "RolesPermissions_role_id_permission_id_key" ON "RolesPermissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "Providers_nit_key" ON "Providers"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "Providers_documentId_key" ON "Providers"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Partners_documentId_key" ON "Partners"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccounts_account_number_key" ON "BankAccounts"("account_number");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesPermissions" ADD CONSTRAINT "RolesPermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesPermissions" ADD CONSTRAINT "RolesPermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
