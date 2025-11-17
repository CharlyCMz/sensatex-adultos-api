import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { SalesModule } from './sales/sales.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import AppConfig from './config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      isGlobal: true,
    }),
    ProductsModule,
    UsersModule,
    SalesModule,
    DatabaseModule,
    UtilsModule,
    AuthModule,
    ReportsModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
