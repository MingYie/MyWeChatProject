import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting,chooseAddress,openSetting,showToast } from "../../utils/asyncWeiXin.js"
import { request } from "../../request/index.js";

Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked);

    // 1 总价格 总数量 全选
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num*v.subTitle;
      totalNum += v.num;
    });
    
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
    console.log(this.data.address.buyName);
  },

  //点击支付
  async handlerOrderPay(){
  //判断缓存中有没有token
    

    //创建订单
    //准备请求头参数
    const orderPrice = this.data.totalPrice;
    const buyName = this.data.address.buyName;
    const buyPhone = this.data.address.buyPhone;
    const buyAddress = this.data.address.buyAddress;
    const cart = this.data.cart;
    let goodsList=[];
  
    cart.forEach(v=>goodsList.push({
      goods_id:v.id,
      goods_number:v.num,
      goods_price:v.subTitle
    }));
    goodsList = JSON.stringify(goodsList)
    const orderParams = {orderPrice,buyName,buyPhone,buyAddress,goodsList};
    const header = { 'content-type': 'application/x-www-form-urlencoded' };
    //发送请求 创建订单 获取订单编号  http://localhost:8081/v1/api/order/create
    const {data} = await request({url:"/order/create",method:"POST",data:orderParams,header:header});
    if (data.data.length>9) {
      await showToast({title:"支付成功"});
      //手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      //支付成功了跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order?type2=1',
      });
    }
    
    // wx.request({
    //   url: 'http://localhost:8081/v1/api/order/create',
    //   data: orderParams,
    //   header: { 'content-type': 'application/x-www-form-urlencoded' },
    //   method: 'POST',
    //   success: (result)=>{
    //     console.log(result);
    //   },
    // });
    
  }

})