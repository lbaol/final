import $ from 'jquery';
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';

const domain = 'http://127.0.0.1:8080';
const pythonDomain = 'http://127.0.0.1:8001';

function getUrl(path){
    if (path.startsWith("http"))
      return path;

      if(path.indexOf('/python/') >=0){
          return pythonDomain + path;
      }
    return domain + path;
  }

function convertReqData(reqData){
    for (let key in reqData) {
        if (typeof reqData[key] === 'object') {
            reqData[key] = JSON.stringify(reqData[key]);
        }
    } 
}

export function request(
    url,
    callback,
    reqData = {},
    dataType='jsonp',
    type,
    async,
    jsonpCallback) {
        convertReqData(reqData);
        return $.ajax({
            type: type?type:'get',
            dataType: dataType,
            url: getUrl(url),
            data:reqData,
            timeout:1000000,
            xhrFields: {
                withCredentials: true
            },
            async:async,
            jsonpCallback:jsonpCallback
        }).done(function(data){
            callback(data);
        });
}


export function request2(
    url,
    reqData = {},
    dataType,
    mothod) {
        convertReqData(reqData);
        return axios.request({
            url:getUrl(url),
            method:mothod?mothod:'get',
            adapter:dataType=='jsonp'?jsonpAdapter:null,
            withCredentials:true,
            params:reqData
        })
}


export function request_sync(
    url,
    callback,
    reqData = {}
    ) {
        convertReqData(reqData);
        return $.ajax({
            type: 'get',
            dataType: 'json',
            url: getUrl(url),
            data:reqData,
            timeout:1000000,
            xhrFields: {
                withCredentials: true
            },
            async:false
        }).done(function(data){
            callback(data);
        });
}