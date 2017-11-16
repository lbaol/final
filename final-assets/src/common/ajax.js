import {URL,Util} from './config.js';
import $ from 'jquery';

export function request(
    url,
    callback,
    reqData = {},
    dataType='jsonp') {
        $.ajax({
            type: dataType=='jsonp'?'get':'post',
            dataType: dataType,
            url: Util.getUrl(url),
            data:reqData,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data){
            callback(data);
        });
}