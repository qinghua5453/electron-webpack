// import axios from 'axios';
const axios = require('axios')
const  { remote } = require('electron')

// 创建新实例
var instance = axios.create({
	method:'get', //default
	baseURL:'',   // base url
	headers:{
		'Content-Type': 'application/json',
		'X-CSRFTOKEN': remote.getGlobal('csrftoken') ? remote.getGlobal('csrftoken') : ''
	},
	timeout: 5000,
	data:{},  // request body
	params:{}, //  url 查询对象
	transformRequest: [function (data, headers) {
       // Do whatever you want to transform the data
       return JSON.stringify(data);
    }],
    transformResponse: [function (data) {
       // Do whatever you want to transform the data
       // var objData = Qs.parse(data)
       // return JSON.parse(data);
       return data
    }],
    withCredentials:true, // cross-site Access-Control requests
    responseType: 'json', // default
})

// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Add a request interceptor
instance.interceptors.request.use(function (config) {
	// Do something before request is sent
    return config;
  }, function (error) {
  	// Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
	        console.log('error---<<<', error.response)
			if(error && error.response){
					switch (error.response.status) {
						case 404 :
							layer.alert('请求地址:' + error.config.url + '出错！')
							break
						case 408 :
							layer.alert('请求超时！')
							break
						case 500 :
							layer.alert('服务器出错！')
							break
						default  :
							try {
								layer.alert(error.response.data.detail)
							}catch(err) {
								console.log(err)
								throw err
							}
					}
			}
			return Promise.reject(error);
  });

// 通用 ajax
exports.axiosRequest = (params) => {
	if(typeof params.url == undefined) {
   	 throw 'url should de must'
    }
    return new Promise((resolve, reject) => {
		instance(params).then((resp) => {
			resolve(resp.data)
		}).catch((error) => {
			reject(error)
		})
    })
}