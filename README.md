# Marval-Test

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Packages version
prisma version must be the same as its command cli version
Example: "@prisma/client": "^4.16.1", "prisma": "^4.16.1"
Mandatory to avoid issues.

## Customize configuration

## CREATE MODELS FROM COMMAND LINE
Model must be written like: user, patient, this will create="UserModel.ts,PatientModel.ts."
in case of more words, must be written like: userAssistance, this will generate=UserAssistanceModel

```sh
npm run model --model=user
```

## CREATE CONTROLLERS FROM COMMAND LINE
Controller must be written like: user, patient, this will create="UserController.ts, PatientController.ts."
in case of more words, must be written like: userAssistance, this will generate=UserAssistanceController

```sh
npm run controller --controller=user
```

## WHEN CLONE REPOSITORY DO THE FOLLOWING STEPS:

step 1

```sh
npm install
```

step 2
create database in postgresql with database name: marval_test

step 3
example.env file in the project RENAME TO => .env

step 4
Change the following: POSTGRES_PASSWORD_HERE => your real password
DATABASE_URL="postgresql://postgres:POSTGRES_PASSWORD_HERE@localhost:5432/marval_test?schema=public&pool_timeout=5"

step 5
```sh
npm run db_generate
```

step 6
```sh
npm run db_migrate
```

step 7
```sh
npm run db_seed
```