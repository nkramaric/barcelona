/**
 * Comments - Defines all routes for /emails
 * @module routes/comments
 */
'use strict';

const express = require('express');
const router = express.Router();
const { asyncify } = require('../util/async-middleware');
const fs = require('fs');
const YAML = require('yamljs');
const path = require('path');
const Git = require('nodegit');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);
const lstat = promisify(fs.lstat);
const exec = promisify(require('child_process').exec);

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
    res.render('pages/index', { 
        pages: pages
    });
}));

router.get('/about', asyncify(async (req, res, next) => {
    res.render('pages/about');
}));

const getFileUri = function(req) {
    let uri = req.params.name;
    if (req.params['0']) {
        uri = uri + req.params['0'];
    }
    uri = path.resolve('./pages/' + uri + '.yaml');
    return uri;
}

router.get('/edit/:name*', asyncify(async (req, res, next) => {
    console.log(req.params);
    const uri = getFileUri(req);
    let fileData;
    try {
        fileData = await readFile(uri, 'utf8');
    } catch(e) {
        res.status(404).json({ msg: "route doesn't exist "});
        return;
    }
    res.render('pages/edit', { route: req.params.name, data: fileData });
}));

router.post('/edit/:name*', asyncify(async (req, res, next) => {
    const uri = getFileUri(req);
    try {
        await lstat(uri);
    } catch(e) {
        res.status(404).json({ msg: "route doesn't exist "});
        return;
    }
    const fileData = await writeFile(uri, req.body, 'utf8');
    const { stdout, stderr } = await exec('git commit -m "made a commit"');
    console.log(stdout);
    res.json('pages/edit', { data: stdout });
}));

module.exports = router;