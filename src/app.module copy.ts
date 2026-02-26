// import { Module, Global } from '@nestjs/common';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { Client } from 'src/model/Master/Client';
// import { Staff } from 'src/model/Master/Staff';
// import { Subscription } from 'src/model/Master/Subscription';
// import { HttpModule } from '@nestjs/axios';
// import { ClsModule, ClsService } from 'nestjs-cls';
// import { ScheduleModule } from '@nestjs/schedule';
// import { User } from 'src/model/Client/User';
// import { Agreement } from 'src/model/Client/Agreement';
// import { Plot } from 'src/model/Client/Plot';
// import { Buyer } from 'src/model/Client/Buyer';
// import { LedgerEntry } from 'src/model/Client/LedgerEntry';
// import { MapImage } from 'src/model/Client/MapImage';
// import { Property } from 'src/model/Client/Property';
// import { AuthModule } from 'src/auth/auth.module';
// import { QnatkControllerService, QnatkModule } from 'src/qnatk/src';
// import { BhawaniQnatkService } from 'src/bhawani-qnatk.service';
// import { BhawaniQnatkControllerService } from 'src/bhawani-qnatk-controller.service';
// import { ModelActions } from 'src/model-actions';
// import { AppController } from 'src/app.controller';
// import { AppService } from 'src/app.service';
// import { HelperService } from 'src/helper/helper.service';
// import { FilesService } from 'src/files/files.service';
// import { SmsService } from 'src/sms/sms.service';
// import { AuthService } from 'src/auth/auth.service';
// import { MyDate } from 'src/helper/my-date';
// import { DatabaseModule } from './database/database.module';
// import QEntityActions from './qnatk/src/models/QEntityActions';
// import QRoles from './qnatk/src/models/QRoles';
// import QRolePermissions from './qnatk/src/models/QRolePermissions';
// import databaseConfig from './config/database.config';
// import { QnatkController } from './qnatk.controller';
// import { DynamicDatabaseService } from './database/dynamic-database-service';

// // Add this debug code right after imports
// console.log('QRoles:', QRoles);
// console.log('QRoles name:', QRoles?.name);
// console.log('QRoles prototype:', QRoles?.prototype);
// console.log('QEntityActions:', QEntityActions);
// console.log('QRolePermissions:', QRolePermissions);
// export const sequelizeModelArray = [
//   QEntityActions,
//   QRoles,
//   QRolePermissions,
//   Staff,
//   Subscription,
//   Client,
//   User,
//   Agreement,
//   Plot,
//   Buyer,
//   LedgerEntry,
//   MapImage,
//   Property,
// ];

// console.log('sequelizeModelArray:', sequelizeModelArray);
// console.log(
//   'sequelizeModelArray names:',
//   sequelizeModelArray.map((m) => m?.name),
// );

// @Global()
// @Module({
//   imports: [
//     HttpModule,
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [databaseConfig],
//     }),
//     ClsModule.forRoot({
//       global: true,
//       middleware: { mount: true },
//     }),
//     ScheduleModule.forRoot(),
//     SequelizeModule.forRootAsync({
//       imports: [ConfigModule, DynamicDatabaseService],
//       useFactory: (configService: ConfigService, cls: ClsService) => ({
//         dialect: 'mysql',
//         host: configService.get('database.master.host'),
//         port: configService.get<number>('database.master.port'),
//         username: configService.get('database.master.username'),
//         password: configService.get('database.master.password'),
//         database: configService.get('database.master.database'),
//         autoLoadModels: true, // ✅ Keep this as true like working project
//         synchronize: false,
//         logQueryParameters: true,
//         logging: console.log,
//         timezone: '+05:30',
//         pool: {
//           max: +configService.get<string>('DB_POOL_MAX', '20'),
//           min: +configService.get<string>('DB_POOL_MIN', '5'),
//           acquire: +configService.get<string>('DB_POOL_ACQUIRE', '30000'),
//           idle: +configService.get<string>('DB_POOL_IDLE', '10000'),
//         },
//         dialectOptions: {
//           dateStrings: true,
//           typeCast: true,
//           multipleStatements: true,
//         },
//         define: {
//           hooks: {
//             afterUpdate: async (instance) => {
//               const changedFields = instance.changed();
//               const changes = {};

//               if (changedFields) {
//                 changedFields.forEach((field) => {
//                   if (
//                     instance.constructor.name === 'ContentFile' &&
//                     field === 'content'
//                   ) {
//                     changes[field] = {
//                       from: 'old content',
//                       to: 'new value',
//                     };
//                   } else {
//                     changes[field] = {
//                       from: (instance as any)._previousDataValues[field],
//                       to: instance.dataValues[field],
//                     };
//                   }
//                 });

//                 const user = cls.get('user');
//                 if (user) {
//                   const changeLog = {
//                     id: (instance as any).id,
//                     changes,
//                     timestamp: new MyDate(new Date()).toString(false),
//                     user_id: user.id,
//                   };
//                   // Your logging logic here
//                 }
//               }
//             },
//             afterDestroy: async (instance) => {
//               const user = cls.get('user');
//               if (user) {
//                 const deleteLog = {
//                   id: (instance as any).id,
//                   data: instance.dataValues,
//                   timestamp: new MyDate(new Date()).toString(false),
//                   user_id: user.id,
//                 };
//                 // Your logging logic here
//               }
//             },
//           },
//         },
//       }),
//       inject: [ConfigService, ClsService],
//     }),
//     // DatabaseModule,
//     AuthModule,
//     QnatkModule.forRoot(
//       {
//         hooksDirectory: __dirname + '/hooks',
//       },
//       [AppModule, SequelizeModule.forFeature(sequelizeModelArray)], // ✅ AppModule को यहाँ रखें
//       [
//         BhawaniQnatkService,
//         BhawaniQnatkControllerService,
//         {
//           provide: 'MODEL_ACTIONS',
//           useValue: ModelActions,
//         },
//       ],
//       [BhawaniQnatkControllerService],
//     ),
//     SequelizeModule.forFeature(sequelizeModelArray),
//   ],
//   controllers: [AppController, QnatkController],
//   providers: [
//     AppService,
//     HelperService,
//     FilesService,
//     BhawaniQnatkService,
//     BhawaniQnatkControllerService,

//     {
//       provide: 'MODEL_ACTIONS',
//       useValue: ModelActions,
//     },
//     SmsService,
//     AuthService,
//   ],
//   exports: [
//     SequelizeModule,
//     HelperService,
//     FilesService,
//     BhawaniQnatkService,
//     BhawaniQnatkControllerService,
//     SmsService,
//     AuthService,
//   ],
// })
// export class AppModule {}
