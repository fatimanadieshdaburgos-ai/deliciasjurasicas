import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { RecipesModule } from './recipes/recipes.module';
import { ProductionModule } from './production/production.module';
import { InventoryModule } from './inventory/inventory.module';
import { PromotionsModule } from './promotions/promotions.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryModule } from './delivery/delivery.module';
import { CashBoxModule } from './cash-box/cash-box.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { AddressesModule } from './addresses/addresses.module';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
    imports: [
        // Global configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting
        ThrottlerModule.forRoot([
            {
                ttl: parseInt(process.env.THROTTLE_TTL) || 60,
                limit: parseInt(process.env.THROTTLE_LIMIT) || 10,
            },
        ]),

        // Core modules
        CoreModule,

        // Business modules
        AuthModule,
        UsersModule,
        ProductsModule,
        CategoriesModule,
        RecipesModule,
        ProductionModule,
        InventoryModule,
        PromotionsModule,
        CartModule,
        OrdersModule,
        OrdersModule,
        DeliveryModule,
        CashBoxModule,
        ReportsModule,
        SettingsModule,
        AddressesModule,
        SuppliersModule,
    ],
})
export class AppModule { }
