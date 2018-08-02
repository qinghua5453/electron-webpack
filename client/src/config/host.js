exports.host = () => {
    if(process.env.NODE_ENV == 'development') {
        return 'http://127.0.0.1:9000'
    }else {
        return 'http://xxf.yxsjob.com'
    }
}