'use strict';

const asyncify = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((err) => {
        next(err);
      });
  };

module.exports = {
  asyncify
};
