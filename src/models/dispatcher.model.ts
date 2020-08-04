export type DispatcherHandler<T> = (payload: T) => void;

export class Dispatcher {

    private _handlers: { [key: number]: DispatcherHandler<any>[] } = {};

    public on(command: GameCommand, handler: DispatcherHandler<any>): void {
        
        if (!this._handlers[command]) {
            this._handlers[command] = [];
        }

        this._handlers[command].push(handler);
    }

    public dispatch<TPayload>(command: GameCommand, payload: TPayload): void {

        if (this._handlers[command]) {
            this._handlers[command].forEach(handler => {
                handler(payload);
            })
        }
    }
}

export enum GameCommand {
    playSound = 1
}
