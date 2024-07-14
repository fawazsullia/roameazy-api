import { Module, RequestMethod } from '@nestjs/common';
import * as allControllers from './controllers';
import * as allServices from './services';

import { MongooseModule } from '@nestjs/mongoose';
import Config from './configs/base.config';
import ModelConfig from './schemas/model.config';
import { AppLoggerMiddleware } from './middlewares';
import { StaticGenAuth } from './middlewares/static-gen-auth.middleware';

const controllers = Object.values(allControllers);
const services = Object.values(allServices);

@Module({
  imports: [MongooseModule.forRoot(Config().db.uri),
  MongooseModule.forFeature(ModelConfig()),
  ],
  controllers,
  providers: services,
})
export class AppModule {
  configure(consumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes("*");
    consumer.apply(StaticGenAuth).exclude(
      { path: 'content', method: RequestMethod.POST },
      { path: 'content/update', method: RequestMethod.POST }
    ).forRoutes(allControllers.ContentController);
  }
}
