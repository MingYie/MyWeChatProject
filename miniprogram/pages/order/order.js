import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting,chooseAddress,openSetting,showToast } from "../../utils/asyncWeiXin.js"
import { request } from "../../request/index.js";
var time = require('../../utils/formatTime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        name:"全部",
        isActive:true
      },
      {
        id:1,
        name:"待发货",
        isActive:false
      },
      {
        id:2,
        name:"待收货",
        isActive:false
      },
      {
        id:3,
        name:"退款/退货",
        isActive:false
      }
    ]
  },

  onShow(options){

    // 判断缓存中有没有token
    // const token = wx.getStorageSync("token");
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/auth',
    //   });
    //   return;
    // }
    // 获取当前的小程序的页面栈数组 长度最大是10
    let pages = getCurrentPages();
    // 数组中索引最大的就是当前页面
    let currentPage = pages[pages.length-1];
    //获取url上的type参数
    const {type2} =  currentPage.options;
    console.log(type2);
    // 根据type值激活选中页面标题 当type=1 index=0
    this.changeTitleByIndex(type2-1);
    this.getOrders(type2);
  },

  //获取订单列表的方法
  async getOrders(type2){
    const res = await request({url:"/order/select",data:{type2}});
    let order = res.data.data;
    order.forEach(v=>v.created=time.formatTimeTwo(v.created,'Y/M/D h:m:s'));
    this.setData({
      // orders:order.map(v=>({...v,create_time_cn:(new Date(v.created).toLocaleString())}))
      orders:order
    })
  },
  
  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
      //获取data中的源数组
    //第一种写法：let {tabs} = this.data;
    //第二种写法：let tabs = this.data.tabs
    let tabs = JSON.parse(JSON.stringify(this.data.tabs));
    //循环数组
    // [].forEach 遍历数组遍历数组的时候修改了v，也会导致源数组被修改
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //把修改的tabs重新放入data中 重新赋值
    this.setData({
      tabs
    })
  },



 //自定义事件用来接收子组件传递过来的数据
 handleItemChange(e){
  //1 获取索引 这里不知道为什么index要必须加{}TAT 应该都要加{}吧
  const {index} = e.detail;
  this.changeTitleByIndex(index);
  //2 重新发送请求 type=1 index=0
  this.getOrders(index+1);
}

 
})