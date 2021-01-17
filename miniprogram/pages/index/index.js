// 0 引入用来发送请求的方法一定要把路径补全
import { request } from "../../request/index.js";

//Page Object
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航栏数据
    navigatorList:[],
    //楼层数据
    floorList:[]
  },
  //options(Object) 页面开始加载就会触发
  onLoad: function(options){
    //1.发送异步请求获取轮播图数据
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    
    this.getSwiperList();
    this.getnavigatorList();
    this.getfloorListt();
  },

  //获取轮播图数据
  getSwiperList(){
    request({url:"/content/ppt?categoryld=99"})
    .then(result=>{
      this.setData({
        swiperList:result.data.data
      })
    })
  },
  //获取导航栏数据
  getnavigatorList(){
    request({url:"/content/navigator?categoryld=102"})
    .then(result=>{
      this.setData({
        navigatorList:result.data.data
      })
    })
  },
  //获取楼层数据
  getfloorListt(){
    request({url:"/content/floor?categoryld=89"})
    .then(result=>{
      this.setData({
        floorList:result.data.data
      })
    })
  }
});