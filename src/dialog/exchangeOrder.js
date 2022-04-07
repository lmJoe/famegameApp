import Data from "../common/Data";
import Scenes from "../common/Scenes";
import { ajax } from "../units/ajax";
import { playSoundClick } from "../units/units";
import URL from "../units/url";

export default class exchangeOrder extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.closeBtn  = this.topBox.getChildByName("closeBtn");
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.clickBtnClick);
      this.addressMsg1.on(Laya.Event.MOUSE_DOWN,this,this.addressMsg1Click);
      this.addressMsg2.on(Laya.Event.MOUSE_DOWN,this,this.addressMsg1Click);
      this.shortlyBtn.on(Laya.Event.MOUSE_DOWN,this,this.AddOrder);
      this.shopId = Data.orderMsg;
      this.itemID = this.shopId.id;
      this.orderMsg1.getChildByName("orderTitle").text = this.shopId.name;
      this.orderMsg1.getChildByName("orderImg").skin = this.shopId.img;
      this.getUserAddress()
    }

    onDisable() {
    }
    clickBtnClick(){
      playSoundClick()
      Laya.Dialog.close(Scenes.exchangeOrder)
    }
    /**获取地址 */
    getUserAddress(){
      console.log("地址id",Data.addressID)
      ajax({
        type: 'POST',
        url: URL.getUserAddress,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            console.log("地址",res);
            if(res.data.length==0){
              this.addressMsg1.visible = true;
              this.addressMsg2.visible = false;
            }else{
              this.addressMsg1.visible = false;
              this.addressMsg2.visible = true;
              let dataName = Data.addressName.length>7?Data.addressName.substr(0,7) + "...":Data.addressName;
              let dataSourceName = res.data[0].userName.length>7?res.data[0].userName.substr(0,7) + "...":res.data[0].userName;
              this.addressMsg2.getChildByName("name").text = dataName?dataName:dataSourceName;
              this.addressMsg2.getChildByName("name").width = dataName?dataName.length*32+20:dataSourceName.length*32+20;
              this.addressMsg2.getChildByName("phone").text = Data.addressMobile?Data.addressMobile:res.data[0].mobile;
              this.addressMsg2.getChildByName("phone").x = dataName?Data.addressName.substr(0,7).length*30+172:res.data[0].userName.substr(0,7).length*30+172;
              // this.addressMsg2.getChildByName("areaMsg").text = res.data[0].provinceName+res.data[0].cityName+res.data[0].areaName+res.data[0].address;
              //清除地址中的空格回车
              let replacyAddress1,replacyAddress2;
              if(Data.addressIntro){
                replacyAddress1 = Data.addressIntro.replace(/\ +/g,"");
                replacyAddress2 = replacyAddress1.replace(/[\r\n]/g,"");
                if(replacyAddress2.length>42){
                  replacyAddress2 = replacyAddress2.substr(0,42) + "...";
                }
              }else{
                replacyAddress1 = res.data[0].address.replace(/\ +/g,"");
                replacyAddress2 = replacyAddress1.replace(/[\r\n]/g,"");
                if(replacyAddress2.length>42){
                  replacyAddress2 = replacyAddress2.substr(0,42) + "...";
                }
              }
              // let dataArea = Data.addressIntro.length>42?Data.addressIntro.substr(0,42) + "...":Data.addressIntro;
              // let dataSourceArea = res.data[0].address.length>42?res.data[0].address.substr(0,42) + "...":res.data[0].address;
              this.addressMsg2.getChildByName("areaMsg").text = replacyAddress2
              this.orderMsg1.y = 400;
              Data.addressID = Data.addressID?Data.addressID:res.data[0].id;
            }
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    /**提交兑换 */
    AddOrder(){
      ajax({
        type: 'POST',
        url: URL.AddOrder,
        data:{
          itemID:this.itemID,
          addressID:Data.addressID,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            //跳转至兑换记录
            Data.sceneValue = 1;
            Laya.Dialog.open(Scenes.exchangelist);
          }else{
            Laya.Dialog.open(Scenes.Tip, false, {content:res.msg});
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
    }
    addressMsg1Click(){
      Data.addressPageType = 1;
      Laya.Dialog.open(Scenes.shippAddress)
    }
}