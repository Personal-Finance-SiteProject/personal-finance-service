import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from "./common/entities/users.entity";
import { ConfigModule } from '@nestjs/config';
import { UtilLib } from "./common/libs/util.lib";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '../.env'}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_MAIN_HOST,
      port: parseInt(process.env.DB_MAIN_PORT ?? '3306'),
      username: process.env.DB_MAIN_USERNAME,
      password: process.env.DB_MAIN_PASSWORD,
      database: process.env.DB_MAIN_DATABASE,
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [],
  providers: [
    UtilLib
  ],

})
export class AppModule {}
