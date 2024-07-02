import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictExcepton extends HttpException {
  constructor(msg?: string) {
    super(msg || 'User with this email already exist', HttpStatus.BAD_REQUEST);
  }
}
