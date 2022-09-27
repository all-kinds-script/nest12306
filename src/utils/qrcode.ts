import jsQR from 'jsqr'
import * as jimp from 'jimp'
import { Buffer } from 'buffer'
import * as QRCode from 'qrcode'

export const decodeQr = async ({ data, type = 'base64' }: { data: string; type?: BufferEncoding }) => {
    const buffer = Buffer.from(data, type)
    const imageDate = await jimp.read(buffer)
    const { width, height } = imageDate.bitmap
    const decode = jsQR(new Uint8ClampedArray(imageDate.bitmap.data), width, height)

    return decode.data
}

export const encodeQrTerminal = async (data: string) => {
    console.log(
        await QRCode.toString(data, {
            type: 'terminal',
            small: true,
            errorCorrectionLevel: 'medium',
            // version: 0,
            // maskPattern: 1,
        })
    )
}
