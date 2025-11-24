import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Delicias Jurásicas API')
        .setDescription(
            'API completa para sistema ERP + E-commerce de pastelería. ' +
            'Incluye gestión de inventario, producción, ventas, entregas y tesorería.',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Autenticación y autorización')
        .addTag('Users', 'Gestión de usuarios')
        .addTag('Products', 'Catálogo de productos e insumos')
        .addTag('Categories', 'Categorías de productos')
        .addTag('Recipes', 'Recetas (Bill of Materials)')
        .addTag('Production', 'Órdenes de producción')
        .addTag('Inventory', 'Control de inventario')
        .addTag('Promotions', 'Promociones y descuentos')
        .addTag('Cart', 'Carrito de compras')
        .addTag('Orders', 'Pedidos y ventas')
        .addTag('Delivery', 'Entregas y logística')
        .addTag('CashBox', 'Control de caja')
        .addTag('Reports', 'Reportes y analytics')
        .addTag('Settings', 'Configuración y CMS')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║     🦖 DELICIAS JURÁSICAS API 🍰                      ║
  ║                                                       ║
  ║     Server running on: http://localhost:${port}        ║
  ║     API Documentation: http://localhost:${port}/api/docs  ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
}

bootstrap();
