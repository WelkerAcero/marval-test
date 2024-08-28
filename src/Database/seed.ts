import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.departments.createMany({
        data: [
            { name: 'ANTIOQUIA' },
            { name: 'ATLÁNTICO' },
            { name: 'BOGOTÁ, D.C.' },
            { name: 'BOLÍVAR' },
            { name: 'BOYACÁ' },
            { name: 'CALDAS' },
            { name: 'CAQUETÁ' },
            { name: 'CAUCA' },
            { name: 'CESAR' },
            { name: 'CÓRDOBA' },
            { name: 'CUNDINAMARCA' },
            { name: 'CHOCÓ' },
            { name: 'HUILA' },
            { name: 'LA GUAJIRA' },
            { name: 'MAGDALENA' },
            { name: 'META' },
            { name: 'NARIÑO' },
            { name: 'NORTE DE SANTANDER' },
            { name: 'QUINDIO' },
            { name: 'RISARALDA' },
            { name: 'SANTANDER' },
            { name: 'SUCRE' },
            { name: 'TOLIMA' },
            { name: 'VALLE DEL CAUCA' },
            { name: 'ARAUCA' },
            { name: 'CASANARE' },
            { name: 'PUTUMAYO' },
            { name: 'ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALIN' },
            { name: 'AMAZONAS' },
            { name: 'GUAINÍA' },
            { name: 'GUAVIARE' },
            { name: 'VAUPÉS' },
            { name: 'VICHADA' },
        ],
    })

    await prisma.roles.createMany({
        data: [
            { rol_name: 'SUPER ADMIN' },
        ],
    })

    await prisma.permissions.createMany({
        data: [
            { type: 'CREATE' },
            { type: 'READ' },
            { type: 'UPDATE' },
            { type: 'DELETE' },
            { type: 'CHANGE-STATUS' },
        ],
    })

    await prisma.users.createMany({
        data: [
            {
                documentType: 'Cédula de Ciudadanía',
                documentId: '1102384212',
                name: 'Welker Jose',
                lastname: 'Perez Acero',
                cellphone: '3213655354',
                email: 'welkerperez97@gmail.com',
                password: '6fa4d7fe116cec75a814426d68b4ab89353a1dd82033572ad9feb381ff0c547d',
                remember_token: null,
                role_id: 1,
            },
        ],
    })


    await prisma.rolesPermissions.createMany({
        data: [
            { role_id: 1, permission_id: 1 },
            { role_id: 1, permission_id: 2 },
            { role_id: 1, permission_id: 3 },
            { role_id: 1, permission_id: 4 },
            { role_id: 1, permission_id: 5 },
            { role_id: 1, permission_id: 6 },
            { role_id: 1, permission_id: 7 },
            { role_id: 1, permission_id: 8 },
            { role_id: 1, permission_id: 9 },
            { role_id: 1, permission_id: 10 },
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


