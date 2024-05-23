import { Module } from '@nestjs/common';
import * as allControllers from './controllers';
import * as allServices from './services';

import { MongooseModule } from '@nestjs/mongoose';

const controllers = Object.values(allControllers);
const services = Object.values(allServices);

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers,
  providers: services,
})
export class AppModule {}
