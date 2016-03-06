import { ObserveObjectPath, Keypath } from 'observe-object-path';
import { Observable, CompositeDisposable } from 'rx';
import * as React from 'react';
import { Component, ComponentClass } from 'react';
import store from '../store';

type KeypathMap = { [key: string]: Keypath };
type ObservableMap = { [key: string]: Observable<any> };

const oop = new ObserveObjectPath(store.getState());

store.subscribe(() => {
  oop.update(store.getState());
});

function entries(obj: { [key: string]: Keypath }) {
   return Object.keys(obj).map((key) => [key, obj[key]]) as [string, Keypath][];
}

export default function<P> (
  getKeypath: (props: P) => KeypathMap,
  transform?: (observables: ObservableMap) => ObservableMap): (Comp: ComponentClass<any>) => ComponentClass<P>
{
  return function (Comp: ComponentClass<any>): ComponentClass<P> {
    class StoreObserver extends Component<P, { [key: string]: any }> {

      private observableMap: ObservableMap;
      private disposableBag: CompositeDisposable;

      constructor(props) {
        super(props);
        this.state = {};
        this.observableMap = {};
      }

      private disposeStoreKeypathSubscription() {
        if (this.disposableBag) {
          this.disposableBag.dispose();
          this.disposableBag = null;
        }
      }

      private subscribeToStoreKeypath(props) {
        this.disposeStoreKeypathSubscription();
        const keypathMap = getKeypath(props);
        for (const [key, keypath] of entries(keypathMap)) {
          this.observableMap[key] = oop.observe(keypath);
        }
        if (transform) {
          this.observableMap = transform(this.observableMap);
        }
        this.disposableBag = new CompositeDisposable();
        Object.keys(this.observableMap).forEach((key) => {
          const disposable = this.observableMap[key].subscribe((val) => this.setState({ [key]: val }));
          this.disposableBag.add(disposable);
        });
      }

      componentWillMount() {
        this.subscribeToStoreKeypath(this.props);
      }

      componentWillReceiveProps(nextProps) {
        this.subscribeToStoreKeypath(nextProps);
      }

      componentWillUnmount() {
        this.disposeStoreKeypathSubscription();
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
