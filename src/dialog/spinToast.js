import Scenes from "../common/Scenes";
import { report } from "../units/statReport";
import { getCaption } from "../units/units";

export default class spinToast extends Laya.Dialog {

    onEnable() {
      this.goExchangeBtn.on(Laya.Event.MOUSE_DOWN,this,this.goExchangeBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */

      Laya.loader.load(this._param.imgUrl, Laya.Handler.create(this, (texture)=>{
        this.spinImg.skin=this._param.imgUrl;
        let ratio=texture.height/texture.width;
        this.spinImg.size(342, 342*ratio);
      }), null, Laya.Loader.IMAGE)
      this.spinText.text = this._param.name+'一张';
      this.linkUrl = this._param.linkUrl;
    }
    
    goExchangeBtnClick(){
      var params = {
        action_type:'点击',
        content:'大转盘-'+this.spinText.text+'-去使用',
        channel_name:'大转盘',
        content_id:'',
        content_cat:'',
        content_cat_id:'',
      }
      report(params);
      //跳转至兑换页
      getCaption(this.linkUrl)
      Laya.Dialog.close(Scenes.spinToast);
    }
    closeBtnClick(){
      Laya.Dialog.close(Scenes.spinToast);
    }

}