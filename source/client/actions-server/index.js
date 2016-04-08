import {bindActionCreators} from 'redux';
import {toPairs, pipe, filter, fromPairs} from 'ramda';
import store from '../store';
import * as creatorsAndTypes from './creators';

// Filter out actions types, which all start with upper case
//
const creators = pipe(
  toPairs,
  filter(([ name ]) => !/^[A-Z]/.test(name)),
  fromPairs
)(creatorsAndTypes);

// Work around ES2015 static export
//
module.exports = bindActionCreators(creators, store.dispatch.bind(store));
