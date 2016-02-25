import { fromPairs } from 'ramda';
import * as _creators from './creators';

export const creators = fromPairs(
  Object.keys(_creators)
    .filter((key) => /^[^A-Z]/.test(key))
    .map((key) => [key, _creators[key]])
);
