'use strict'
const fs = require('fs')
const config = require('./package.config.js')

let getManifest = () => {
    let mfPath = './asset/build/manifest.json'

    return new Promise((resolve, reject) => {
        fs.readFile(mfPath, (err, data) => {
            if(err) {
                console.log('err', err)
                reject(err)
            } else {
                resolve(JSON.parse(data))
                // console.log('data', JSON.parse(data))
            }
        })
    })
}

let modifyHtmlStr = (data, bundle) => {
    if(/<script.*\.bundle\.js"><\/script>/i.test(data)&& /<link rel="stylesheet".*\.bundle\.css"\/?>/i.test(data)) {
        if(bundle.js) {
            data = data.replace(/<script.*\.bundle\.js"><\/script>/i, '<script src="' + bundle.js + '"></script>')
        }
        if(bundle.css) {
            data = data.replace(/<link rel="stylesheet".*\.bundle\.css"\/?>/i, '<link rel="stylesheet" href="' + bundle.css + '">')
        }
    }else {
        throw 'bundle.js and bundle.css must be add in index'
    }
    return data
}

let updateProdHTMLPages = () => {
    getManifest().then(data => {
        let bundleMap = {}
        for(let key in data) {
            if(key.indexOf('bundle') > -1) {
                continue
            }
            if(/\.css/.test(key)) {
                let bundleKey = key.replace('.css', '')
                if(bundleMap[bundleKey]) {
                    bundleMap[bundleKey].css = data[key]
                } else {
                    bundleMap[bundleKey] = {
                        css: data[key]
                    }
                }
            } else if(/\.js/.test(key)) {
                let bundleKey = key.replace('.js', '')
                if(bundleMap[bundleKey]) {
                    bundleMap[bundleKey].js = data[key]
                } else {
                    bundleMap[bundleKey] = {
                        js: data[key]
                    }
                }
            }
        }
        let filePaths = ['./index.html', './index_webview.html']
        let key
        for(let i = 0; i < filePaths.length; i++) {
            let filePath = filePaths[i]
            fs.readFile(filePath, (err, data) => {
                if (err) return
                if(i == 0)  key = 'src/main'
                if(i == 1)  key = 'src/webview_index'
                data = modifyHtmlStr(data.toString(), bundleMap[key])
                fs.writeFile(filePath, data, (err, data) => {
                    if (err) return
               })
            })
        }
    }).catch((err) => {
        console.log('[error]: manifest.json read error', err)
    })
}

let bundleMap = () => {
   let bundles = {}
   let entries = config.entries
   let len = entries.length
   let host = 'http://localhost:3000'
   for(let i = 0; i < len; i++) {   
        let entry = entries[i]
        let prefix = config.outputDir.replace('.', '')
        entry = entry.replace('./', '').replace('.js', '')
        bundles[entry] = {
            'js': host + prefix + entry + '.bundle.js'
        }
        bundles[entry]['css'] = host + prefix + entry + '.bundle.css'
    }
    return bundles
}

let setDevHTMLPages = () => {
    let bundles = bundleMap()
    let filePaths = ['./index.html', './index_webview.html']
    let key
    for(let i = 0; i < filePaths.length; i++) {
        let filePath = filePaths[i]
        fs.readFile(filePath, (err, data) => {
            if (err) return
            if(i == 0)  key = 'src/main'
            if(i == 1)  key = 'src/webview_index'
            data = modifyHtmlStr(data.toString(), bundles[key])
            fs.writeFile(filePath, data, (err, data) => {
                if (err) return
           })
        })
    }
}

let isProduction  = process.env.NODE_ENV === 'development' ? false : true   

if(isProduction) {
    updateProdHTMLPages()
} else {
    setDevHTMLPages()
}