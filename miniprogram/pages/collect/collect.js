// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        name:"菜品收藏",
        isActive:true
      },
      {
        id:1,
        name:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        name:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        name:"浏览足迹",
        isActive:false
      }
    ]
  },

  onShow(){
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      collect
    })
  },

  //自定义事件用来接收子组件传递过来的数据
  handleItemChange(e){
    //1 获取索引 这里不知道为什么index要必须加{}TAT 应该都要加{}吧
    const {index} = e.detail;
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


})