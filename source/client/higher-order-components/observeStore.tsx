import { ObserveObjectPath, Keypath } from 'observe-object-path';
import { Observable } from 'rx';
import * as React from 'react';
import { Component, ComponentClass } from 'react';
import store from '../store.ts';

type KeypathMap = { [key: string]: Keypath };
type ObservableMap = { [key: string]: Observable<any> };

export default function<P> (
  getKeypath: (props: P) => KeypathMap,
  transform?: (observables: ObservableMap) => ObservableMap): (Comp: ComponentClass<any>) => ComponentClass<P>
{
  return function (Comp: ComponentClass<any>): ComponentClass<P> {
    class StoreObserver extends Component<P, { [key: string]: any }> {
      constructor() {
        super();
        this.state = {};
      }

      componentWillMount() {
        const keypathMap = getKeypath(this.props);
        const oop = new ObserveObjectPath(store.getState());
        let observableMap: ObservableMap = {};
        for (const key of Object.keys(keypathMap)) {
          const keypath = keypathMap[key];
          observableMap[key] = oop.observe(keypath);
        }
        if (transform) {
          observableMap = transform(observableMap);
        }
        Object.keys(observableMap).forEach((key) => {
          observableMap[key].subscribe((val) => this.setState({ [key]: val }));
        });
        store.subscribe(() => {
          oop.update(store.getState());
        });
      }

      componentWillUnmount() {

      }

      render() {
        return (
          <Comp {...this.state} {...this.props} />
        );
      }
    }

    return StoreObserver;
  };
}
