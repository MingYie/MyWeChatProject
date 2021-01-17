// pages/user/user.js
Page({

  data:{
    userinfo:{},
    //被收藏的商品的数量
    collectNums:0
  },
  onShow(){
    const userinfo =  wx.getStorageSync("userinfo");
    console.log(userinfo);
    const collectArray = wx.getStorageSync("collect");
    this.setData({
      userinfo,
      collectNums:collectArray.length
    })
  }

  
})