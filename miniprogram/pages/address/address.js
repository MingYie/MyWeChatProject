import { request } from "../../request/index.js";
// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();
  },

  async getAddressList(){

    const result = await request({url:"/address/select"});
    console.log(result);
    this.setData({
      addressList:result.data.data
    });
  },
  handleItemClick:function(e){
    let addressItem = this.data.addressList[e.currentTarget.dataset.index];
    let pages =  getCurrentPages();//获取当前页面js里面的pages里的所有信息
    let prevPage = pages[pages.length-2];//prevPages是获取上一个页面js里面的pages的所有信息，-2是上一个页面，-3是上上一个页面
    prevPage.setData({
      addressList:addressItem,
      address:addressItem
    });
    //跳到上一页
    wx.navigateBack({
      delta: 1
    });
  },

  //新增地址
  handleAddAddress:function(e){
    wx.navigateTo({
      url: '/pages/addressCRUD/addressCRUD?id=',
    });
  },

  //修改地址
  handleEditItem:function(e){
    let addressItem = this.data.addressList[e.currentTarget.dataset.index];
    //跳转到修改页面
    wx.navigateTo({
      url: '/pages/addressCRUD/addressCRUD?id='+addressItem['id'],
    });
  },

  //长按收货地址，删除当前所选的地址
  handleLongClick(e){
    let addressItem = this.data.addressList[e.currentTarget.dataset.index];
    wx.showModal({
      title: '删除确认',
      content: '您确定要删除该地址吗？',
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          wx.request({
            url: 'http://localhost:8081/v1/api/address/delete',
            data: {id:addressItem['id']},
            header: {'content-type':'application/json'},
            method: 'GET',
            success: (result) => {
              this.getAddressList();
            },
            fail: (res) => {this.getAddressList();}
          });  
        }
      },
    });
      
  }
  
})