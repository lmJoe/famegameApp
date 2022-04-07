/* eslint-disable */
import Data from "../common/Data.js";
import Scenes from "../common/Scenes.js";
import { decrypt, secretKey, getQueryVariable, getCookie, setCookie, clearCookie, changeUrlArg } from "./units.js";
import Bridge from "./JSbridge.js";
import gameControl from "../game/gameControl.js";
import MineCtrl from "../game/mine/MineCtrl.js";
import GameConfig from "../GameConfig.js";
import MineWorkerCtrl from "../game/mine/MineWorkerCtrl.js";
var ajaxAppid = getQueryVariable("appId");
var ajaxPlatformId = getQueryVariable("platformId");
var userToken = getQueryVariable("userToke");
console.log("链接token",userToken);
Bridge.registerHandler('isVisible', (data, responseCallback) => {
  //更新兑换中心数据
  if(JSON.parse(data).isVisible==1){
    Bridge.callHandler('getToken','',(res)=>{
      userToken = JSON.parse(res).token;
      if(userToken==''){
        console.log("当前token值1",userToken)
        Data.tokenKey = true;
        Data.haveGetMineInfo = false;
        // userToken = '';
        changeUrlArg(window.location.href,'userToke','')
        console.log("当前链接111111",window.location.href)
        Laya.Scene.open(Scenes.bmhframe,true);
      }else{
        //已登录状态
        console.log("当前token值2",userToken)
        changeUrlArg(window.location.href,'userToke', userToken)
        gameControl.I.getfameMsg()
        gameControl.I.getFameLandInfo();
        //判断矿场接口是否调用
        if(Data.haveGetMineInfo){
          //矿场接口已调用
          Data.tokenKey = false;
          setTimeout(() => {
            gameControl.I.MineCtrilFun();
          }, 500);
        }else{
          //矿场接口未调用
          console.log(2)
          //如果为未登录的情况下 再次点击登录框
          Data.tokenKey = true;
          setTimeout(() => {
            gameControl.I.MineCtrilFun();
          }, 500);
          
        }
        console.log("当前链接22222",window.location.href)
      }
    })
  }
})
function ajax (options){
  /**@type {XMLHttpRequest} */
  let xhr = null, retry=0, retryMax=0, retryTime=1000, errMsg='request failed';
  let params = formsParams(options.data);
  //创建对象
  if(window.XMLHttpRequest){
      xhr = new XMLHttpRequest()
  } else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  function send(){
    
    //获取当前url中的keycode
    if(options.type == "GET"){
        xhr.open(options.type,options.url + "?"+ params);
        xhr.send(null)
    } else if(options.type == "POST"){
      
        xhr.open(options.type,options.url);
        if(options.contentType){
          xhr.setRequestHeader("Content-Type",options.contentType);
          xhr.setRequestHeader("keyCode",userToken);
          xhr.setRequestHeader("appId",ajaxAppid==''&&ajaxAppid==null?102:ajaxAppid);
          xhr.setRequestHeader("platformId",ajaxPlatformId==''&&ajaxPlatformId==null?1003:ajaxPlatformId);
        }else{
          xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
          xhr.setRequestHeader("keyCode",userToken);
          xhr.setRequestHeader("appId",ajaxAppid==''||ajaxAppid==null?102:ajaxAppid);
          xhr.setRequestHeader("platformId",ajaxPlatformId==''||ajaxPlatformId==null?1003:ajaxPlatformId);
          console.log(userToken,ajaxAppid,ajaxPlatformId);
        }
        xhr.send(params);
    }
  }
  send();

  xhr.ontimeout=()=>{
    console.log('time out');
    errMsg='time out';
  }

  xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        if (xhr.status == 200) {
          let data=xhr.response;
          if(options.decrypt!=false){
            let reg = /^["|'](.*)["|']$/g;
            data= data.replace(reg,"$1");
            data=decrypt(data, secretKey);
          }
          if(data!==''){
            data=JSON.parse(data);
          }
          if(data.code==-1){
            errMsg=data.msg;
            errorHandler();
          }else{
            // console.log(options.url, data);
            options.success(data);
          }
        }else{
          if(retry<retryMax){
            retry++;
            console.log('http error, retry: '+retry);
            setTimeout(() => {
              send();
            }, retryTime*retry);
          }else{
            if(xhr.status){
              errMsg=xhr.status;
            }
            errorHandler();
          }
        }
      }
  }

  function errorHandler(){
    console.log("options",options)
    if(options.error){
      options.error(errMsg);
    }else{
      console.log("errMsg",errMsg)
      // Laya.Dialog.open(Scenes.Tip, true, {content:errMsg, handler:()=>{
      //   // window.location.reload();
        
      // }});
    }
  }

  function formsParams(data){
      var arr = [];
      for(var prop in data){
          arr.push(prop + "=" + data[prop]);
      }
      return arr.join("&");
  }
}
export{
  ajax
}