import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { join } from 'path'

@Injectable()
export class StationsConfigService {
    public stations // 读取的所有站点

    constructor() {
        this.loadStationsTxt()
    }

    protected loadStationsTxt() {
        const stationsTxt = readFileSync(join(process.cwd(), 'public/txt/stations.txt'), 'utf-8')
        let stationsArr: string[] | object = stationsTxt.split('@')
        const stations = {}

        Array.isArray(stationsArr) &&
            stationsArr.map((item: string | object) => {
                const temp = typeof item === 'string' && item.split('|')

                stations[temp[1]] = {
                    key: temp[2],
                    name: temp[1],
                    pinyin: temp[3],
                    id: temp[5],
                }
            })

        this.stations = stations
    }

    public replaceStationToCode(configStations) {
        configStations.forEach((config, index) => {
            const from = config.from
            const to = config.to

            configStations[index].from = this.stations[from].key
            configStations[index].to = this.stations[to].key
        })

        return configStations
    }
}
