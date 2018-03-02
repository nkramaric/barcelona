/**
 * Comments - Defines all routes for /emails
 * @module routes/comments
 */
'use strict';

const express = require('express');
const router = express.Router();
const { asyncify } = require('../util/async-middleware');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const YAML = require('yamljs');
const path = require('path');

router.get('/', asyncify(async (req, res, next) => {
    res.render('pages/index');
}));

router.get('/', asyncify(async (req, res, next) => {
    res.render('pages/about');
}));

router.get('/:name*', asyncify(async (req, res, next) => {
    console.log(req.params.name);
    console.log(req.param(0));
    const uri = path.resolve('./pages/' + req.params.name + '.yaml');
    const fileData = await readFile(uri, 'utf8');
    const data = YAML.parse(fileData);
    res.json(data);
}));

module.exports = router;
