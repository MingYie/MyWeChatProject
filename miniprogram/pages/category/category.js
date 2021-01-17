import regeneratorRuntime from '../../lib/runtime/runtime';
// 0 引入用来发送请求的方法一定要把路径补全
import { request } from "../../request/index.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左边菜单数据
    leftList:[],
    //中餐菜单数据
    picList:[],
    //西餐菜单数据
    pic2List:[],
    //下午茶数据
    pic3List:[],
    //被点击的左侧菜单的id值 也就是后台数据中的id值
    curNav:0,
    //被点击的左侧菜单的索引
    curIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0,
    model:0
  },
  //接口的返回数据
  Categroy:[],


  bindTapTo1:function(){
    wx.navigateTo({
      url: "/pages/goods_list/goods_list?title=navigate"
    })
  },
  bindTapTo2:function(){
    wx.navigateTo({
      url: "/pages/goods_list/goods_list?title=2"
    })
  },
  bindTapTo3:function(){
    wx.navigateTo({
      url: "/pages/goods_list/goods_list?title=3"
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /*
    0web中的本地存储和小程序中的本地存储的区别
    1写代码的方式不一样了
    web:
    localStorage . setItem( "key"，"value") localStorage . getItem( "key" )
    小程序中: wx. setStorageSync("key", "value"); Wx . getStorageSync("key");
    2:存的时候有没有做类型转换
    web:不管存入的是什么类型的数据，最终都会先调用以下toString(), 把数据变成了字符串再存入进去
    小程序:不存在类型转换的这个操作存什么类似的数据进去，获取的时候就是什么类型
    1先判断一下本地存储中有没有旧的数据
    {time :Date . now() , data:[...]}
    2没有旧数据直接发送新请求
    3有旧的数据同时旧的数据也没有过期就使用本地存储中的旧数据即可
    */

    // this.getCategroyList();
    //1.获取本地存储中的数据
    const Category = wx.getStorageSync("category");
    console.log(Category)
    //2.判断
    if(!Category){
      //不存在 发送请求获取数据
      this.getCategroyList();
    }
    else{
      //有旧的数据 定义过期时间 10s改成5分钟
      if(Date.now()-Category.time>1000*10){
        //重新发送请求
        this.getCategroyList();
      }else{
        //可以使用旧的数据
        console.log("可以使用旧数据")
        this.Categroy=Category.data;
        let leftList = this.Categroy.map(v=>v.title);
        let picList = this.Categroy.map(v=>v.pic);
        let pic2List = this.Categroy.map(v=>v.pic2);
        let pic3List = this.Categroy.map(v=>v.pic3);
        this.setData({
          leftList,
          picList,
          pic2List,
          pic3List,
          Categroy:this.Categroy,
          model:leftList[0]
        })
      }
    }

    
  },

  //获取菜单分类数据
  async getCategroyList(){
    // request({url:"/content/category?categoryld=92"})
    // .then(result=>{
    //   this.Categroy=result.data.data;

    //   //把接口中的数据存入到本地存储中  Date.now()时间戳
    //   wx.setStorageSync("category", {time:Date.now(),data:this.Categroy});
    //   //构造左边的大菜单
    //   let leftList = this.Categroy.map(v=>v.title);
    //   let picList = this.Categroy.map(v=>v.pic);
    //   let pic2List = this.Categroy.map(v=>v.pic2);
    //   let pic3List = this.Categroy.map(v=>v.pic3);
    //   this.setData({
    //     leftList,
    //     picList,
    //     pic2List,
    //     pic3List,
    //     Categroy:result.data.data
    //   })
    // })

    //1.使用es7的async await来发送请求 异步请求
    const result = await request({url:"/content/category?categoryld=92"});
    this.Categroy=result.data.data;
    //把接口中的数据存入到本地存储中  Date.now()时间戳
    wx.setStorageSync("category", {time:Date.now(),data:this.Categroy});
    //构造左边的大菜单
    let leftList = this.Categroy.map(v=>v.title);
    let picList = this.Categroy.map(v=>v.pic);
    let pic2List = this.Categroy.map(v=>v.pic2);
    let pic3List = this.Categroy.map(v=>v.pic3);
    this.setData({
      leftList,
      picList,
      pic2List,
      pic3List,
      Categroy:result.data.data
    })
  },

  navTap(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    const {index} = e.currentTarget.dataset
    console.log(id);
    console.log({index});
    this.setData({
      curNav: id,
      curIndex:index,
      //重新设置右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    })
  },

  //下拉刷新事件
  onPullDownRefresh(){
    //1.重置数组
    // this.setData({
    //   Categroy:[],
    //   leftList:[]
    // })

    // this.getCategroyList();
  }

})