'use strict'
const fs = require('fs')
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
    if(/<script.*\.bundle\.js"><\/script>/i.test(data) && /<link rel="stylesheet".*\.bundle\.css"\/?>/i.test(data)) {
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
        for(let key in bundleMap) {
            let filePath = './index.html'
            fs.readFile(filePath, (err, data) => {
                if(err) {
                    console.log('[error]: failed to read ', filePath, err)
                    return
                }
                data = modifyHtmlStr(data.toString(), bundleMap[key])
                fs.writeFile(filePath, data, (err, data) => {
                    if(err) {
                        console.log('[error]: failed to update ' + filePath)
                        return
                    }
                    console.log('[success]: ' + filePath + ' updated successfully')
                })
            })
        }
    }).catch((err) => {
        console.log('[error]: manifest.json read error', err)
    })
}

let setDevHTMLPages = () => {

    let bundleMap = {
        js: 'http://127.0.0.1:3000/asset/build/app.bundle.js',
        css: 'http://127.0.0.1:3000/asset/build/app.bundle.css'
    }
    let filePath = './index.html'
    fs.readFile(filePath, (err, data) => {
        if(err) {
            console.log('[error]: failed to read ' + filePath)
            return
        }
        for(let key in bundleMap) {
            data = modifyHtmlStr(data.toString(), bundleMap)
            fs.writeFile(filePath, data, (err, data) => {
                if(err) {
                    console.log('[error]: failed to update ' + filePath)
                    return
                }
                console.log('[success]: ' + filePath + ' updated successfully')
            })
        }
    })
}

let isProduction  = process.env.NODE_ENV === 'development' ? false : true   

if(isProduction) {
    updateProdHTMLPages()
} else {
    setDevHTMLPages()
}