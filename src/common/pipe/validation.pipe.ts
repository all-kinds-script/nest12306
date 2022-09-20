import CustomExceptionError from '@/common/filter/exception.custom'
import { ArgumentMetadata, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata

        // 普通校验
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }

        // class-transformer 校验
        const object = plainToInstance(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            const errorMessageList = []

            const errorsObj = errors[0].constraints
            for (const key in errorsObj) {
                if (errorsObj.hasOwnProperty(key)) {
                    errorMessageList.push(errorsObj[key])
                }
            }

            throw new CustomExceptionError(errorMessageList, HttpStatus.BAD_REQUEST)
        }
        return value
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object]
        return !types.find((type) => metatype === type)
    }
}
