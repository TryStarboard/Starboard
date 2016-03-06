declare module 'observe-object-path' {

  import Rx = require('rx');

  export class ObserveObjectPath {
      obj: Object;
      private observers;
      constructor(obj?: Object);
      update(newObj: Object): void;
      observe<T>(keypath: Keypath): Rx.Observable<T>;
  }

  export type Keypath = (string | number)[];

}
