import { inspect } from 'util'

// 展示对象所有 key value
export const customInspect = (show: any) => {
    console.log(
        inspect(show, {
            colors: true,
            depth: Infinity,
            breakLength: Infinity,
            compact: false,
            sorted: true,
            getters: true,
        })
    )
}
