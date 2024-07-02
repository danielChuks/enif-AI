import { HttpException, HttpStatus } from '@nestjs/common';

//creating our own exceptions...................
export class UserNotFoundException extends HttpException {
  constructor(msg?: string) {
    super(msg || 'Not found', HttpStatus.BAD_REQUEST);
  }
}
