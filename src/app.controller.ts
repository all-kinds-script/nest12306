import { Controller, Get } from '@nestjs/common'

@Controller('app')
export class AppController {
    @Get()
    getHello(): string {
        console.log('执行')
        return 'start'
    }
}
