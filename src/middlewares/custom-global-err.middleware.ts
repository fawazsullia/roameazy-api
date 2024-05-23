import {
    ArgumentsHost,
    Catch,
    HttpServer,
    HttpStatus,
    Inject,
  } from '@nestjs/common';
  import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
  
  @Catch()
  export class CustomGlobalError extends BaseExceptionFilter {
    constructor(
      @Inject(HttpAdapterHost)
      protected applicationRef?: HttpServer<any, any, any>,
    ) {
      super(applicationRef);
    }
  
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      // const request = ctx.getRequest();
      // const status = exception.getStatus();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
  
      let message =
        exception instanceof Error ? exception.message : exception.message.error;
  
      if (
        exception.response?.message &&
        Array.isArray(exception.response.message)
      ) {
        message = exception.response.message.join(',');
      }
  
      if (exception.status === HttpStatus.NOT_FOUND) {
        status = HttpStatus.NOT_FOUND;
      }
  
      if (exception.status === HttpStatus.SERVICE_UNAVAILABLE) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
      }
  
      if (exception.status === HttpStatus.NOT_ACCEPTABLE) {
        status = HttpStatus.NOT_ACCEPTABLE;
      }
  
      if (exception.status === HttpStatus.EXPECTATION_FAILED) {
        status = HttpStatus.EXPECTATION_FAILED;
      }
  
      if (exception.status === HttpStatus.BAD_REQUEST) {
        status = HttpStatus.BAD_REQUEST;
      }
      console.log('Error: status: ', status, 'error: ', message);
      response.status(status).json({
        status,
        success: false,
        data: [],
        error: message,
        message:
          status === HttpStatus.INTERNAL_SERVER_ERROR
            ? 'Sorry we are experiencing technical problems.'
            : '',
      });
    }
  }