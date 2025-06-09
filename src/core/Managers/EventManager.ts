import { Signal } from 'micro-signals';

interface Signals {
  [name: string]: Signal<any>;
}

interface EventHistory {
  name: string;
  payload: any;
  timestamp: Date;
}

const show: string[] = ['boolean', 'string', 'number'];

export class EventManager {
  private static instance: EventManager;
  private signals: Signals = {};
  private eventHistory: EventHistory[] = [];
  private listenerCount: { [name: string]: number } = {};

  private constructor() {}

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  private getSignal(name: string): Signal<any> {
    if (!this.signals[name]) {
      this.signals[name] = new Signal();
      this.listenerCount[name] = 0;
    }
    return this.signals[name];
  }

  public listSignals(): void {
    Object.keys(this.signals).forEach((signalName) => {
      console.log(`Global of Events ${signalName}`, 'SIGNAL');
    });
  }

  private onCustom(name: string, handler: (payload: any) => void, trigger: string, once: boolean): void {
    const wrap = (payload: any): void => {
      if (String(payload) === trigger) {
        if (once) this.off(name, wrap);
        handler(payload);
      }
    };
    this.getSignal(name).add(wrap);
    this.listenerCount[name]++;
  }

  public once(name: string, handler: (payload: any) => void): void {
    const [signal, custom] = name.split('|');
    if (custom) {
      this.onCustom(signal, handler, custom, true);
    } else {
      this.getSignal(signal).addOnce(handler);
      this.listenerCount[signal]++;
    }
  }

  public on(name: string, handler: (payload: any) => void): void {
    const [signal, custom] = name.split('|');
    if (custom) {
      this.onCustom(signal, handler, custom, false);
    } else {
      this.getSignal(signal).add(handler);
      this.listenerCount[signal]++;
    }
  }

  public promise(name: string): Promise<any> {
    return new Promise((resolve) => this.once(name, resolve));
  }

  public off(name: string, handler: (payload: any) => void): void {
    this.getSignal(name).remove(handler);
    this.listenerCount[name]--;
  }

  public dispatch(name: string, payload?: any, avoidLogger: boolean = false): void {
    const details: string = show.includes(typeof payload) ? ` => ${payload}` : '';
    const [type] = name.split(':');
    if (!avoidLogger) {
      console.log(`${name}${details}`, type);
    }

    this.getSignal(name).dispatch(payload);

    this.eventHistory.push({
      name,
      payload,
      timestamp: new Date(),
    });
  }

  public getLastEvent(): EventHistory | undefined {
    return this.eventHistory[this.eventHistory.length - 1];
  }

  public getEventCount(name: string): number {
    return this.listenerCount[name] || 0;
  }

  public getEventStatistics(): EventHistory[] {
    return this.eventHistory;
  }
}

export const Event = EventManager.getInstance();
