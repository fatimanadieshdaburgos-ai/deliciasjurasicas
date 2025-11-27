import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.product.count();
        console.log(`Total products: ${count}`);

        const products = await prisma.product.findMany({
            take: 5,
            select: { id: true, name: true, isActive: true }
        });
        console.log('Sample products:', JSON.stringify(products, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
