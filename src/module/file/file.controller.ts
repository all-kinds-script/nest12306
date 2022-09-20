import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express'

@Controller('file')
export class FileController {
    @Post('single-file')
    @UseInterceptors(FileInterceptor('file1'))
    singleFile(@UploadedFile() file: Express.Multer.File) {
        // 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息
        return file
    }

    @Post('multiple-file')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'file1', maxCount: 1 },
            { name: 'file2', maxCount: 1 },
        ])
    )
    arrayFile(
        @UploadedFiles()
        file: {
            file1?: Express.Multer.File[]
            file2?: Express.Multer.File[]
        }
    ) {
        return file
    }

    @Post('any')
    @UseInterceptors(AnyFilesInterceptor())
    anyFile(@UploadedFiles() file: Array<Express.Multer.File>) {
        return file
    }
}
