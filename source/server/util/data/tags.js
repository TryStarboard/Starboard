import { wrap } from 'co';
import db from '../db';

export const getAll = wrap(function *(id) {
  const { rows } = yield db.raw(`
    SELECT id, text, foreground_color, background_color
    FROM tags
    WHERE user_id = ?
    ORDER BY id DESC`,
    [id]
  );
  return rows;
});

export const addTag = wrap(function *(user_id, text) {
  const [tag] = yield db('tags').insert({user_id, text}, '*');
  return tag;
});
