import helmet from 'helmet';
import chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { EnvInterface } from './interfaces/common.interface';

const APP = 'My Playlist API';
const PORT = 5100;

/**
 * ANCHOR Bootstrap
 * @date 02/04/2025 - 22:18:15
 *
 * @async
 * @returns {*}
 */
async function bootstrap() {
  // create app
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn'],
      cors: {
        origin: '*',
      },
    });

  // trust proxy
  app.set('trust proxy', 1);

  // helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: process.env.NODE_ENV == 'production',
    }),
  );

  // shutdown hooks
  app.enableShutdownHooks();

  // start app
  await app.startAllMicroservices();

  await app.listen(PORT, '0.0.0.0', () => {
    // messages
    let messages: string[] = [];

    if (process.env.NODE_ENV == 'production') {
      messages = [
        chalk.magenta(APP),
        chalk.green('IS RUNNING ON PORT:'),
        chalk.yellow(PORT),
      ];
    } else {
      messages = [
        chalk.magenta(APP),
        chalk.green('IS RUNNING ON:'),
        chalk.yellow(`http://localhost:${PORT}`),
      ];
    }

    console.log(...messages);
  });
}

// run app
bootstrap();

// global
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvInterface {
      NODE_ENV: 'test' | 'development' | 'production';
    }
  }
}
