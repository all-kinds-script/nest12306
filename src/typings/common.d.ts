namespace Common {
    interface GenericsObject<T> {
        [prop: string]: T
    }
}

export = Common
