import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    await prisma.roles.createMany({
        data: [
            { rol_name: 'SUPER ADMIN' },
            { rol_name: 'ADMIN' },
        ],
    })

    await prisma.permissions.createMany({
        data: [
            { type: 'PROVIDER-CREATE' },
            { type: 'PROVIDER-READ' },
            { type: 'PROVIDER-UPDATE' },
            { type: 'PROVIDER-DELETE' },
            { type: 'CHANGE-STATUS' },
        ],
    })

    await prisma.users.createMany({
        data: [
            {
                documentType: 'Cédula de Ciudadanía',
                documentId: '1232589088',
                name: 'Welker Jose',
                lastname: 'Perez Acero',
                cellphone: '3213655354',
                email: 'welkerperez97@gmail.com',
                password: '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d', // Password1+
                remember_token: null,
                role_id: 1,
            },

            {
                documentType: 'Cédula de Ciudadanía',
                documentId: '1102384212',
                name: 'Anggie liseth',
                lastname: 'Castellanos',
                cellphone: '3213655353',
                email: 'anggie@gmail.com',
                password: '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d', // Password1+
                remember_token: null,
                role_id: 2,
            },
        ],
    })


    await prisma.rolesPermissions.createMany({
        data: [
            /* Super Admin*/
            { role_id: 1, permission_id: 1 },
            { role_id: 1, permission_id: 2 },
            { role_id: 1, permission_id: 3 },
            { role_id: 1, permission_id: 4 },
            { role_id: 1, permission_id: 5 },

            /* Admin */
            { role_id: 2, permission_id: 1 },
            { role_id: 2, permission_id: 2 },
            { role_id: 2, permission_id: 3 },
        ],
    })

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })


