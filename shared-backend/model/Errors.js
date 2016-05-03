'use strict';

class UniqueConstraintError extends Error {
  constructor(table, field) {
    super();
    this.table = table;
    this.field = field;
  }
}

module.exports = {
  UniqueConstraintError,
};
