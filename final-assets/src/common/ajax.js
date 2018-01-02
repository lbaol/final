import {URL,Util} from './config.js';
import $ from 'jquery';

export function request(
    url,
    callback,
    reqData = {},
    dataType='jsonp',
    type) {
        for (let key in reqData) {
            if (typeof reqData[key] === 'object') {
                reqData[key] = JSON.stringify(reqData[key]);
            }
        } 
        return $.ajax({
            type: type,
            dataType: dataType,
            url: Util.getUrl(url),
            data:reqData,
            timeout:1000000,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data){
            callback(data);
        });
}