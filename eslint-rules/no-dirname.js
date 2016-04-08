'use strict';

module.exports = function (context) {
  return {
    'Program:exit'() {
      context.getScope().through.some((ref) => {
        if (ref.identifier.name === '__dirname') {
          context.report(ref.identifier, 'Do not use __dirname, it will break server bundle with webpack');
        }
      });
    }
  };
};
