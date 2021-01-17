/*
  1发送请求获取数据
  2点击轮播图预览大图
    1给轮播图绑定点击事件
    2调用小程序的api
    previewImage
  3点击加入购物车
    1先绑定点击事件
    2获取缓存中的购物车数据数组格式
    3先判断当前的商品是否已经存在于购物车
    4已经存在修改商品数据执行购物车数量++重新把购物车数组填充回缓存中
    5不存在于购物车的数组中直接给购物车数组添加一个新元素新元素带上购买数量属性num 重新把购物车数组填充回缓存中
    6弹出提示

  4商品收藏
    1页面onShow的时候加载缓 存中的商品收藏的数据
    2判断当前商品是不是被收藏
      1是改变页面的图标I
      2不是
    3点击商品收藏按钮
      1判断该商品是否存在于缓存数组中
      2已经存在把该商品删除
      3没有存在把商品添加到收藏数组中存入到缓存中即可

*/


import regeneratorRuntime from '../../lib/runtime/runtime';
// 0 引入用来发送请求的方法一定要把路径补全
import { request } from "../../request/index.js";
// pages/goods_detail/goods_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObject:{},
    //商品是否被收藏
    isCollect:false,
    category_Id:0,
    //收藏id数组
    categoryArray:[]
  },

  //商品对象
  GoodsInfo:{},
  

  onShow:function(){
    let isCollect = false;
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    console.log(options);
    const{categoryld} = options;

    let categoryArray = wx.getStorageSync("categoryArray")||[];

    let index1 = categoryArray.indexOf(categoryld);
    console.log(index1);
    //如果变量在数组内，则返回1，反之，则返回-1
    if (index1===1) {
      isCollect=true;
    }else{
      isCollect=false;
    }
    this.setData({
      category_Id:categoryld,
      isCollect
    })
    this.getGoodsDetail(categoryld);
  },


  //获取商品详情数据
  async getGoodsDetail(categoryld){
    const goodsObject = await request({url:"/content/XiaoLongBao",data:{categoryld}});
    this.GoodsInfo = goodsObject.data.data
    this.setData({
      goodsObject,
    })
  },

  //点击轮播图
  handlePrivew(){
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.map(v=>v.pic);
    wx.previewImage({
      current: urls[0],
      urls: urls,
    });
  },

  //点击加入购物车
  handleAddCart(){
    //1 获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart")||[];
    //2 判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.id===this.GoodsInfo[0].id);
    if(index===-1){
      // 3 不存在 是第一次添加
      this.GoodsInfo[0].num=1;
       //商品选中状态
      this.GoodsInfo[0].checked=true;
      cart.push(this.GoodsInfo[0]);
    }else{
      //4 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    //6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //true 防止用户一直疯狂点击按钮
      mask: true,
    });
  },

  //点击 商品收藏图标
  handleCollect(){
    let isCollect = false;
    let category = this.data.category_Id;
    //获取缓存中商品收藏数组 判断是否为空
    let collectArray = wx.getStorageSync("collect")||[];
    let categoryArray = wx.getStorageSync("categoryArray")||[];
    // 判断该商品是否被收藏过
    let index = collectArray.findIndex(v=>v.category_Id===category);
    let index1 = categoryArray.lastIndexOf(category);
    console.log(index1+"点击收藏");
    // 如果变量在数组内，则返回1，没找到，则返回-1
    if(index1!==-1){
      //已经收藏过了 要在数组中删除该商品
      collectArray.splice(index,1);
      for (let i = 0; i < categoryArray.length; i++) {
        if (categoryArray[i] === category) {
          categoryArray.splice(i,1);
        } 
      }
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      categoryArray.push(category);
      console.log(categoryArray);
      //没有收藏过
      this.GoodsInfo[0].category_Id=category;
      collectArray.push(this.GoodsInfo[0]);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
      
    }
    //把数组存入缓存中
    wx.setStorageSync("categoryArray",categoryArray);
    wx.setStorageSync("collect", collectArray);
    //修改data中的收藏属性collect
    this.setData({
      isCollect
    })
  }

  
})