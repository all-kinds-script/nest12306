export class ExampleEvent {
    constructor(private payload: ExampleEventPayload) {}
}

interface ExampleEventPayload {
    readonly orderId: number

    readonly payload: object
}
