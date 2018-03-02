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

const getFileUri = function(req) {
    let uri = req.params.name;
    if (req.params['0']) {
        uri = uri + req.params['0'];
    }
    uri = path.resolve('./pages/' + uri + '.yaml');
    return uri;
}

router.get('/:name*', asyncify(async (req, res, next) => {
    const uri = getFileUri(req);
    const fileData = await readFile(uri, 'utf8');
    const data = YAML.parse(fileData);
    res.json(data);
    next();
}));

module.exports = router;
