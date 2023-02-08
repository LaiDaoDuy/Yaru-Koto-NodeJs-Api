import HttpException from './HttpException';

export class ExistedException extends HttpException {
  constructor(value: any) {
    super(409, '', `\'${value.toString}\' existed in Database`);
  }
}
