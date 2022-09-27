import { NetworkInterfaceInfo, networkInterfaces } from "os";

//获取 mac windows ip 地址
export function getIpAddress(ip?) {
    // 网络接口
    const interfaces: NodeJS.Dict<NetworkInterfaceInfo[]> = networkInterfaces()

    const Inter: NetworkInterfaceInfo[] = interfaces['WLAN'] || interfaces['en0']
    let ipAddress = 'localhost'

    for (const value of Inter) {
        const { family, address, internal } = value
        if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
            ipAddress = address
        }

        ip && ip(ipAddress)
    }

    return ipAddress
}
