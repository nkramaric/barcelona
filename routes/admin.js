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
const readDir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);
const YAML = require('yamljs');
const path = require('path');

async function getPages(files, root) {
    if (!files || files.length == 0) {
        return ;
    }
    let response = {
        dir: root,
        files: []   
    };
    for (let file of files) {
        const fileUri = root + file;
        const stats = await lstat(fileUri);
        if (stats.isDirectory()) {
            let fileList = await readDir(fileUri)
            response.files.push(await getPages(fileList, fileUri + '/'));
        } else {
            response.files.push(file);
        }
    }
    return response;
}

router.get('/', asyncify(async (req, res, next) => {
    var files = await readDir('./pages');
    var pages = await getPages(files, './pages/');
    console.log(pages);
    res.render('pages/index', pages);
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
