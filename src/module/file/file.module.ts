import { Temp_File_Path } from '@/config/constant/file'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import dayjs from 'dayjs'
// 文件上传
import { diskStorage } from 'multer'
import { nanoid } from 'nanoid'
import { FileController } from './file.controller'

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: () => ({}),
        }),
        MulterModule.register({
            storage: diskStorage({
                // 配置文件上传后的文件夹路径
                destination: `.${Temp_File_Path}/${dayjs().format('YYYY-MM-DD')}`,
                filename: (req, file, cb) => {
                    // 在此处自定义保存后的文件名称
                    const filename = `${nanoid()}.${file.mimetype.split('/')[1]}`
                    return cb(null, filename)
                },
            }),
        }),
    ],
    controllers: [FileController],
    providers: [],
})
export class FileModule {}
