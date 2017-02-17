import { EventEmitter } from 'events';
import Event from './event';
import { UNIQUE } from './constants';

class ipcMain {
  constructor(pipe) {
    this._emitter = new EventEmitter();
    this._setupProxyReceivers();
    this.IS_MOCK = true;
  }
  
  _setupProxyReceivers() {
    this._emitter.on(`${UNIQUE}-receive`, this._onReceiveFromRenderer.bind(this));
    this._emitter.on(`${UNIQUE}-receiveSync`, this._onReceiveFromRendererSync.bind(this));
  }

  _onReceiveFromRenderer(channel, ...args) {
    const e = new Event(this._emitter);
    this._emitter.emit(channel, e, ...args);
  }
  
  _onReceiveFromRendererSync(channel, ...args) {
    const e = new Event(this._emitter);
    this._emitter.emit(channel, e, ...args);
    return e.returnValue;
  }

  /**
   * Proxy all the EventEmitter methods defined in the IpcRenderer API.
   */
  on(...args) { this._emitter.on(...args); }
  once(...args) { this._emitter.once(...args); }
  removeListener(...args) { this._emitter.removeListener(...args); }
  removeAllListeners(...args) {
    this._emitter.removeAllListeners(...args);
    this._setupProxyReceivers();
  }
}

export default ipcMain;
