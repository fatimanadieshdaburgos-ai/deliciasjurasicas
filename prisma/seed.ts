import { PrismaClient, UserRole, ProductType, MeasureUnit } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...\n');

    // 1. USUARIOS
    console.log('👥 Creando usuarios...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@deliciasjurasicas.com' },
        update: {},
        create: {
            email: 'admin@deliciasjurasicas.com',
            password: await bcrypt.hash('Admin123!', 10),
            firstName: 'Admin',
            lastName: 'Sistema',
            role: UserRole.ADMIN,
            status: 'ACTIVE',
        },
    });

    const panadero = await prisma.user.upsert({
        where: { email: 'panadero@deliciasjurasicas.com' },
        update: {},
        create: {
            email: 'panadero@deliciasjurasicas.com',
            password: await bcrypt.hash('Panadero123!', 10),
            firstName: 'Carlos',
            lastName: 'Ramírez',
            role: UserRole.PANADERO,
            status: 'ACTIVE',
        },
    });

    const vendedor = await prisma.user.upsert({
        where: { email: 'vendedor@deliciasjurasicas.com' },
        update: {},
        create: {
            email: 'vendedor@deliciasjurasicas.com',
            password: await bcrypt.hash('Vendedor123!', 10),
            firstName: 'María',
            lastName: 'González',
            role: UserRole.VENDEDOR,
            status: 'ACTIVE',
        },
    });

    const cliente = await prisma.user.upsert({
        where: { email: 'cliente@example.com' },
        update: {},
        create: {
            email: 'cliente@example.com',
            password: await bcrypt.hash('Cliente123!', 10),
            firstName: 'Juan',
            lastName: 'Pérez',
            phone: '5551234567',
            role: UserRole.CLIENTE,
            status: 'ACTIVE',
        },
    });

    console.log('✅ Usuarios creados\n');

    // 2. CATEGORÍAS
    console.log('📂 Creando categorías...');
    const catPasteles = await prisma.category.upsert({
        where: { slug: 'pasteles' },
        update: {},
        create: {
            name: 'Pasteles',
            slug: 'pasteles',
            description: 'Deliciosos pasteles temáticos',
            isActive: true,
            sortOrder: 1,
        },
    });

    const catPanes = await prisma.category.upsert({
        where: { slug: 'panes' },
        update: {},
        create: {
            name: 'Panes',
            slug: 'panes',
            description: 'Panes artesanales',
            isActive: true,
            sortOrder: 2,
        },
    });

    console.log('✅ Categorías creadas\n');

    // 3. INSUMOS
    console.log('📦 Creando insumos...');
    const harina = await prisma.product.upsert({
        where: { sku: 'INS-HARINA-001' },
        update: {},
        create: {
            sku: 'INS-HARINA-001',
            name: 'Harina de Trigo',
            type: ProductType.INSUMO,
            currentStock: 50,
            minStock: 10,
            measureUnit: MeasureUnit.KG,
            costPrice: 20,
            isActive: true,
        },
    });

    const huevos = await prisma.product.upsert({
        where: { sku: 'INS-HUEVOS-001' },
        update: {},
        create: {
            sku: 'INS-HUEVOS-001',
            name: 'Huevos',
            type: ProductType.INSUMO,
            currentStock: 100,
            minStock: 24,
            measureUnit: MeasureUnit.UN,
            costPrice: 3,
            isActive: true,
        },
    });

    const azucar = await prisma.product.upsert({
        where: { sku: 'INS-AZUCAR-001' },
        update: {},
        create: {
            sku: 'INS-AZUCAR-001',
            name: 'Azúcar',
            type: ProductType.INSUMO,
            currentStock: 30,
            minStock: 5,
            measureUnit: MeasureUnit.KG,
            costPrice: 18,
            isActive: true,
        },
    });

    const mantequilla = await prisma.product.upsert({
        where: { sku: 'INS-MANTEQUILLA-001' },
        update: {},
        create: {
            sku: 'INS-MANTEQUILLA-001',
            name: 'Mantequilla',
            type: ProductType.INSUMO,
            currentStock: 10,
            minStock: 2,
            measureUnit: MeasureUnit.KG,
            costPrice: 80,
            isActive: true,
        },
    });

    console.log('✅ Insumos creados\n');

    // 4. PRODUCTOS TERMINADOS
    console.log('🍰 Creando productos terminados...');
    const pastelTRex = await prisma.product.upsert({
        where: { sku: 'PASTEL-TREX-001' },
        update: {},
        create: {
            sku: 'PASTEL-TREX-001',
            name: 'Pastel T-Rex',
            description: 'Delicioso pastel con forma de dinosaurio',
            type: ProductType.PRODUCTO_TERMINADO,
            currentStock: 5,
            minStock: 2,
            measureUnit: MeasureUnit.UN,
            salePrice: 450,
            costPrice: 180,
            categoryId: catPasteles.id,
            isActive: true,
            isFeatured: true,
        },
    });

    const pastelTriceratops = await prisma.product.upsert({
        where: { sku: 'PASTEL-TRI-001' },
        update: {},
        create: {
            sku: 'PASTEL-TRI-001',
            name: 'Pastel Triceratops',
            description: 'Pastel de chocolate en forma de triceratops',
            type: ProductType.PRODUCTO_TERMINADO,
            currentStock: 3,
            minStock: 1,
            measureUnit: MeasureUnit.UN,
            salePrice: 500,
            costPrice: 200,
            categoryId: catPasteles.id,
            isActive: true,
            isFeatured: true,
        },
    });

    console.log('✅ Productos terminados creados\n');

    // 5. RECETAS (BOM)
    console.log('📝 Creando recetas...');
    const recetaTRex = await prisma.recipe.upsert({
        where: { productId: pastelTRex.id },
        update: {},
        create: {
            productId: pastelTRex.id,
            name: 'Receta Pastel T-Rex',
            description: 'Receta clásica de pastel esponjoso',
            yieldQuantity: 1,
            yieldUnit: MeasureUnit.UN,
            preparationTime: 120,
            instructions: '1. Mezclar ingredientes secos\n2. Agregar huevos y mantequilla\n3. Hornear a 180°C por 45 min',
            ingredients: {
                create: [
                    {
                        ingredientId: harina.id,
                        quantity: 0.5,
                        unit: MeasureUnit.KG,
                    },
                    {
                        ingredientId: huevos.id,
                        quantity: 4,
                        unit: MeasureUnit.UN,
                    },
                    {
                        ingredientId: azucar.id,
                        quantity: 0.3,
                        unit: MeasureUnit.KG,
                    },
                    {
                        ingredientId: mantequilla.id,
                        quantity: 0.2,
                        unit: MeasureUnit.KG,
                    },
                ],
            },
        },
    });

    console.log('✅ Recetas creadas\n');

    // 6. PROMOCIONES
    console.log('🎁 Creando promociones...');
    await prisma.promotion.upsert({
        where: { code: 'TREX2X1' },
        update: {},
        create: {
            code: 'TREX2X1',
            name: '2x1 en Pasteles',
            description: 'Compra 2 pasteles y lleva 3',
            type: 'BUY_X_GET_Y',
            buyQuantity: 2,
            getQuantity: 1,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-12-31'),
            isActive: true,
        },
    });

    await prisma.promotion.upsert({
        where: { code: 'DINO20' },
        update: {},
        create: {
            code: 'DINO20',
            name: '20% de descuento',
            description: '20% de descuento en compras mayores a $300',
            type: 'PERCENTAGE',
            discountValue: 20,
            minPurchase: 300,
            maxDiscount: 150,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-12-31'),
            isActive: true,
        },
    });

    console.log('✅ Promociones creadas\n');

    // 7. CONFIGURACIONES
    console.log('⚙️  Creando configuraciones...');
    await prisma.setting.upsert({
        where: { key: 'site_name' },
        update: {},
        create: {
            key: 'site_name',
            value: 'Delicias Jurásicas',
            type: 'TEXT',
            description: 'Nombre del sitio',
            isPublic: true,
        },
    });

    await prisma.setting.upsert({
        where: { key: 'tax_rate' },
        update: {},
        create: {
            key: 'tax_rate',
            value: '16',
            type: 'NUMBER',
            description: 'IVA (%)',
            isPublic: true,
        },
    });

    await prisma.setting.upsert({
        where: { key: 'free_shipping_threshold' },
        update: {},
        create: {
            key: 'free_shipping_threshold',
            value: '500',
            type: 'NUMBER',
            description: 'Monto mínimo para envío gratis',
            isPublic: true,
        },
    });

    console.log('✅ Configuraciones creadas\n');

    console.log('🎉 Seed completado exitosamente!\n');
    console.log('📧 Credenciales de acceso:');
    console.log('   Admin: admin@deliciasjurasicas.com / Admin123!');
    console.log('   Panadero: panadero@deliciasjurasicas.com / Panadero123!');
    console.log('   Vendedor: vendedor@deliciasjurasicas.com / Vendedor123!');
    console.log('   Cliente: cliente@example.com / Cliente123!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
