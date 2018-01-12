import $ from 'jquery';

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

export function request(
    url,
    callback,
    reqData = {},
    dataType='jsonp',
    type,
    async) {
        for (let key in reqData) {
            if (typeof reqData[key] === 'object') {
                reqData[key] = JSON.stringify(reqData[key]);
            }
        } 
        return $.ajax({
            type: type?type:'get',
            dataType: dataType,
            url: getUrl(url),
            data:reqData,
            timeout:1000000,
            xhrFields: {
                withCredentials: true
            },
            async:async
        }).done(function(data){
            callback(data);
        });
}