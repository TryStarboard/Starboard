import defaults from 'lodash/fp/defaults';
import { DEFAULT_TAG_COLORS } from '../../const';
import { UPDATE_TAGS } from '../../actions/serverActions';

function populateColors(tags) {
  return tags.map((tag) => {
    const colors = DEFAULT_TAG_COLORS[tag.text.toLowerCase()];
    if (!colors) {
      return tag;
    }
    return defaults(tag, {
      background_color: colors.bg,
      foreground_color: colors.fg,
    });
  });
}

export default function (state = [], { type, payload }) {
  switch (type) {
  case UPDATE_TAGS:
    return populateColors(payload);
  default:
    return populateColors(state);
  }
}
