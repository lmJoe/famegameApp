import Data from "../common/Data";
import Scenes from "../common/Scenes";
import { ajax } from "../units/ajax";
import { dateChangeFormat } from "../units/units";
import URL from "../units/url";
import Bridge from "../units/JSbridge.js";
import RequestLoading from "../common/RequestLoading";
export default class shureOrder extends Laya.Dialog {
    constructor() { 
      super();
    }
    
    onEnable() {
      RequestLoading.show()
      this.orderNum = this._param.orderNo;
      this.customer.on(Laya.Event.MOUSE_DOWN,this,this.customerClick);
      this.topBox.getChildByName("closeBtn").on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.getOrderDetail();
    }
    /**订单详情 */
    getOrderDetail(){
      ajax({
        type: 'POST',
        url: URL.getOrderDetail,
        data:{
          orderNo:this.orderNum,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            RequestLoading.hide()
            console.log("订单详情",res)
            let address = res.data.address;
            let createtime = res.data.createtime;
            let itemName = res.data.itemName;
            let status = res.data.status;
            let rescodes = res.data.rescodes;
            let remark = res.data.remark;
            let addressMsg2 = this.addressMsg2;
            let orderMsg2 = this.orderMsg2;

            let addressDetail = address.split("|")[0];
            let addressName = address.split("|")[1];
            let addressPhone = address.split("|")[2];
            let remarkkd = remark.split("|")[0];
            let remarkkdNumber = remark.split("|")[1];
            addressMsg2.getChildByName("name").text = addressName==''||addressName==null?'':addressName.length > 7?addressName.substr(0,7) + "...":addressName;;
            addressMsg2.getChildByName("name").width = addressName.length*32+20;
            addressMsg2.getChildByName("phone").text = addressPhone==''||addressPhone==null?'':addressPhone;
            addressMsg2.getChildByName("phone").x = addressName?addressName.substr(0,7).length*30+172:addressName.substr(0,7).length*30+172;
            let replacyAddress1,replacyAddress2;
            replacyAddress1 = addressDetail.replace(/\ +/g,"");
            replacyAddress2 = replacyAddress1.replace(/[\r\n]/g,"");
            if(replacyAddress2.length>50){
              replacyAddress2 = replacyAddress2.substr(0,50) + "...";
            }

            addressMsg2.getChildByName("areaMsg").text = replacyAddress2==''||replacyAddress2==null?'':replacyAddress2;




            orderMsg2.getChildByName("DeliveryChannels").text = remarkkd==''||remarkkd==null?'':remarkkd;
            orderMsg2.getChildByName("courierNumber").text = remarkkdNumber==''||remarkkdNumber==null?'':remarkkdNumber;

            orderMsg2.getChildByName("status").text = status==1?'已发货':'未发货';
            orderMsg2.getChildByName("exchangeTime").text = dateChangeFormat('YYYY-mm-dd HH:MM:SS',createtime);
            orderMsg2.getChildByName("orderImg").skin = rescodes;
            orderMsg2.getChildByName("orderTitle").text = itemName;
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    customerClick(){
      var params = {"ActivityPath":'activity://com.boyibo.kuaikan.usermodule.activity.PersonLetter.ui.CustomerMessageActivity'};
      Bridge.callHandler('gotoActivity', params, (responseData)=>{});
    }
    closeBtnClick(){
      Data.sceneValue = 1;
      Laya.Dialog.open(Scenes.exchangelist,true);
    }
    onDisable() {
    }
}