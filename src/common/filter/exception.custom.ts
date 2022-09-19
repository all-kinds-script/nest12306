import { HttpException, HttpStatus } from '@nestjs/common'

class CustomExceptionError extends HttpException {
  private static readonly msg = '自定义错误'

  constructor(private readonly objectOrError: object, private readonly code?: number) {
    const msg = CustomExceptionError.msg

    const errRes = {
      data: null,
      code,
      msg,
      timestamp: new Date().getTime(),
      ...objectOrError,
    }

    const errCode = code || HttpStatus.OK

    super(HttpException.createBody(errRes, msg, errCode), errCode)
  }
}

export default CustomExceptionError
