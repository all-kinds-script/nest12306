import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'

@Injectable()
export class LoadTxtService {
    public txtInfo

    constructor() {
        this.loadStationsTxt()
        this.loadCdnTxt()
    }

    protected loadStationsTxt() {
        const stationsTxt = readFileSync(join(process.cwd(), 'public/txt/stations.txt'), 'utf-8')
        let stations: string[] | object = stationsTxt.split('@')

        stations =
            Array.isArray(stations) &&
            stations.map((item: string | object) => {
                const temp = typeof item === 'string' && item.split('|')
                return {
                    key: temp[2],
                    name: temp[1],
                    pinyin: temp[3],
                    id: temp[5],
                }
            })

        const fromStr = '北京'
        const arriveStr = '驻马店'

        const queryAddress = []
        if (stations instanceof Array) {
            const info: { from?: any; arrive?: any } = {}
            for (const item of stations) {
                if (item.name === fromStr) {
                    info.from = item
                } else if (item.name === arriveStr) {
                    info.arrive = item
                }
            }

            queryAddress.push(info)
        }

        this.txtInfo = queryAddress
    }

    protected loadCdnTxt() {
        const cdnTxt = readFileSync(join(process.cwd(), 'public/txt/cdn.txt'), 'utf-8')
    }
}
