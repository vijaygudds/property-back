// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';
// // import * as session from '@types/express-session';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     logger: ['error', 'warn', 'debug', 'log'],
//   });

//   // Global prefix for all routes
//   app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

//   // Enable CORS
//   app.enableCors({
//     origin: process.env.CORS_ORIGIN?.split(',') || '*',
//     credentials: true,
//   });

//   // Session configuration
//   // app.use(
//   //   session({
//   //     secret: process.env.SESSION_SECRET || 'bhawani-secret-key',
//   //     resave: false,
//   //     saveUninitialized: false,
//   //     cookie: {
//   //       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   //     },
//   //   }),
//   // );

//   // Global validation pipe
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//       transformOptions: {
//         enableImplicitConversion: true,
//       },
//     }),
//   );

//   // Swagger API Documentation
//   const config = new DocumentBuilder()
//     .setTitle('भवानी प्रॉपर्टी मैनेजमेंट सिस्टम API')
//     .setDescription(
//       'Property Management System with Hindi Unicode Support\n' +
//         'संपत्ति प्रबंधन प्रणाली - पूर्ण हिंदी समर्थन के साथ\n\n' +
//         'Features:\n' +
//         '- Multi-tenant Architecture\n' +
//         '- Property Management (संपत्ति प्रबंधन)\n' +
//         '- Plot Management with Maps (नक्शा आधारित प्लॉट प्रबंधन)\n' +
//         '- Buyer/Seller/Agent Management\n' +
//         '- Agreement Management (अनुबंध प्रबंधन)\n' +
//         '- Ledger & Accounting (खाता बही)\n' +
//         '- Notifications & Reminders',
//     )
//     .setVersion('1.0')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token',
//         in: 'header',
//       },
//       'JWT-auth',
//     )
//     .addTag('Auth', 'Authentication endpoints (प्रमाणीकरण)')
//     .addTag('Properties', 'Property management (संपत्ति प्रबंधन)')
//     .addTag('Plots', 'Plot management (प्लॉट प्रबंधन)')
//     .addTag('Buyers', 'Buyer management (खरीदार प्रबंधन)')
//     .addTag('Sellers', 'Seller management (विक्रेता प्रबंधन)')
//     .addTag('Agents', 'Agent management (एजेंट प्रबंधन)')
//     .addTag('Agreements', 'Agreement management (अनुबंध प्रबंधन)')
//     .addTag('Ledger', 'Ledger management (खाता बही)')
//     .addTag('Notifications', 'Notifications & Reminders (सूचनाएं)')
//     .addTag('Reports', 'Reports & Analytics (रिपोर्ट)')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api/docs', app, document, {
//     customSiteTitle: 'भवानी प्रॉपर्टी API डॉक्स',
//     customCss: '.swagger-ui .topbar { display: none }',
//   });

//   const port = process.env.PORT || 3000;
//   await app.listen(port);

//   console.log(`
//   ╔═══════════════════════════════════════════════════════════════╗
//   ║                                                                 ║
//   ║     भवानी प्रॉपर्टी मैनेजमेंट सिस्टम                         ║
//   ║     Bhawani Property Management System                         ║
//   ║                                                                 ║
//   ║     🚀 Server running on: http://localhost:${port}              ║
//   ║     📚 API Documentation: http://localhost:${port}/api/docs     ║
//   ║     🌍 Environment: ${process.env.NODE_ENV || 'development'}    ║
//   ║                                                                 ║
//   ╚═══════════════════════════════════════════════════════════════╝
//   `);
// }

// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DatabaseContextInterceptor } from './database-context.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('json', { limit: '50mb' });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(join(__dirname, '..', 'production'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Currently in GetUser Module')
    .setDescription('API documentation for GetUser Module')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Apply database context interceptor globally
  app.useGlobalInterceptors(app.get(DatabaseContextInterceptor));

  await app.listen(3000);
}
bootstrap();
