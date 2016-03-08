import { ObserveObjectPath, Keypath } from 'observe-object-path';
import { Observable, CompositeDisposable } from 'rx';
import React, { Component, ComponentClass } from 'react';
import store from '../store';

const oop = new ObserveObjectPath(store.getState());

store.subscribe(() => {
  oop.update(store.getState());
});

function entries(obj) {
   return Object.keys(obj).map((key) => [key, obj[key]]);
}

export default function (getKeypath, transform) {

  return function (Comp) {

    class StoreObserver extends Component {

      constructor(props) {
        super(props);
        this.state = {};
        this.observableMap = {};
        this.disposableBag = null;
      }

      disposeStoreKeypathSubscription() {
        if (this.disposableBag) {
          this.disposableBag.dispose();
          this.disposableBag = null;
        }
      }

      subscribeToStoreKeypath(props) {
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
