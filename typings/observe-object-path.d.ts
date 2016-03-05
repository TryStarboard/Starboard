declare module 'observe-object-path' {

  import Rx = require('rx');

  export class ObserveObjectPath {
      obj: Object;
      private observers;
      constructor(obj?: Object);
      update(newObj: Object): void;
      observe(keypath: Keypath): Rx.Observable<any>;
  }

  export type Keypath = (string | number)[];

}
