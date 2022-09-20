import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'

@Injectable()
export class LoadService {
    constructor() {
        this.loadTxt()
    }

    loadTxt() {
        const file = readFileSync(join(process.cwd(), ''), 'utf-8')
        let stationsTxt: string[] | object[] = file.split('@')

        stationsTxt = stationsTxt.map((item: string) => {
            const temp = item.split('|')
            return {
                key: temp[2],
                name: temp[1],
                pinyin: temp[3],
                id: temp[5],
            }
        })

        const cdnTxt = readFileSync(join(process.cwd(), 'public/12306/cdn.txt'), 'utf-8')

        const from1 = '北京'
        const arrive1 = '驻马店'

        let from: any = {}
        const arrive: any = []

        const info = stationsTxt.filter((item: any) => {
            if (item.name === from1) {
                from = item
            }

            if (item.name === arrive1) {
                arrive.push(item)
            }
        })
    }
}
