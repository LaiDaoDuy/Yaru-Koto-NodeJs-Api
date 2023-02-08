import HttpException from './HttpException';

export class EmailNotCorrectException extends HttpException {
  constructor() {
    super(400, '', 'Email not correct');
  }
}
