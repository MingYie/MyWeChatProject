import { request } from "../../request/index.js";
// pages/addressCRUD/addressCRUD.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressData:{
      id:'',
      buyName:'',
      buyPhone:'',
      buyAddress:''
    },
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options['id'];
    console.log(id);
    this.data.id = id;
    if(this.data.id){
      this.getAddressListById();
      this.setMyData('id',id);
    }
  },

  /*
  根据id查询当前地址详情
  */
  getAddressListById(e){
    wx.request({
      url: 'http://localhost:8081/v1/api/address/findById',
      data: {
        id:this.data.id
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      success: (result) => {
        console.log(result);
        let bean = result.data.data;
        this.setData({
          addressData:{
            id:bean['id'],
            buyName:bean['buyName'],
            buyPhone:bean['buyPhone'],
            buyAddress:bean['buyAddress']
          }
        })
      },
    });
      
  },

  handleOnInput(e){
    let typename = e.currentTarget.dataset.typename;
    let value = e.detail.value;
    this.setMyData(typename,value);
  },

  setMyData(key,value){
    let addressData = this.data.addressData;
    addressData[key] = value;
    this.setData({
      addressData:addressData
    })
  },

  //提交表单
  handleSave(e){
    let addressList = this.data.addressData;
    wx.request({
      url: 'http://localhost:8081/v1/api/address/save',
      data: {
        id:addressList['id'],
        buyName:addressList['buyName'],
        buyPhone:addressList['buyPhone'],
        buyAddress:addressList['buyAddress']
      },
      header: {'content-type':'application/json'},
      method: 'GET',
      success: (result) => {
        if(result){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
          });
          wx.navigateBack({
            delta: 1
          });
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
  }
  
})