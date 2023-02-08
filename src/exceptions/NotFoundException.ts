import HttpException from './HttpException';

export class NotFoundException extends HttpException {
  constructor(value: any) {
    super(404, '', `Not found \'${value.toString}\' from Database!!`);
  }
}
