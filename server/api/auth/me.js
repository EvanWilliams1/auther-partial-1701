'use strict';

const router = require('express').Router();
const User = require('../users/user.model');
const HttpError = require('../../utils/HttpError');

router.get('/', (req, res, next) => {
    User.findById(req.session.userId)
    .then(user => res.json(user))
    .catch(next);
});

// login
router.put('/', (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({
        where: { email, password }
    })
    .then(user => {
        if (!user) {
            throw new HttpError(401);
        } else {
            req.session.userId = user.id;
            res.json(user);
        }
    })
    .catch(next);
});

// signup
router.post('/', function (req, res, next) {
  const { email, password } = req.body;
  User.findOrCreate({
    where: { email },
    defaults: { password }
  })
  .spread((user, created) => {
    if (created) {
      req.session.userId = user.id;
      res.json(user);
    } else {
      throw new HttpError(401);
    }
  });
});

// logout
router.delete('/', (req, res, next) => {
    delete req.session.userId;
    res.sendStatus(204);
});

module.exports = router;
