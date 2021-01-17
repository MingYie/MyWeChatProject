/*
  1获取用户的收货地址
    1 绑定点击事件
    2 调用小程序内置api
      获取用户的收货地址

    2获取用户对小程序所授予获取地址的 权限状态scope
      1 假设用户点击获取收 货地址的提示框确定 authSetting scope.address 
        scope值true直接调用获取收货地址
      2 假设用户从来没有调用过收货地址的api
        scope undefined 直接调用获取收货地址
      3 假设用户点击获取收货地址的提示框取消
        scope值false 
          1诱导用户自己打开授权设置页面(wx-openSetting) 当用户重新给与获取地址权限的时候
          2获取收货地址
      4. 把收货地址存入到缓存中
  
  2.页面加载完毕
    0 onload onshow
    1 获取本地存储中的地址数据
    2.把数据设置给data中的一个变量

  3 onShow 
    0 回到商品详情页面 第一次添加商品的时候 手动添加了属性
      1 num = 1；
      2 checked=true；
    1获取缓存中的购物车数组
    2把购物车数据填充到data中
  4全选的实现数据的展示
    1onShow获取缓存中的购物车数组
    2根据购物车中的商品数据所有的商品都被选中checked=true 全选就被选中
  5 商品的选中
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态取反
    4 重新填充回data中和缓存中
    5 重新计算全选。总价格 总数量。

  6 全选 反选
    1 全选复选框绑定事件 change
    2 获取data中的全选变量 allChecked
    3 直接取反 allChecked = ！allChecked
    4 遍历购物车数组里的商品 选中状态跟随allChecked改变而改变
    5 把购物车数组 和 allChecked重新设置回data 把购物车重新设置回缓存中

  7 商品数量的编辑
    1 "+" "-" 按钮绑定同一个点击事件区分的关键自定义属性
      1 '+' "+1"
      2 '-' "-1"

    2传递被点击的商品id goods_ _id
    3获取data中的购物车数组来获取需要被修改的商品对象
    4直接修改商品对象的数量num 当购物车数量=1&&用户点击“-”，要弹窗提示（showModal） 询问用户 是否要删除 ，a.确定就执行删除 b.取消就什么都不做
    5把cart数组重新设置回缓存中和data中this. setCart
  
  8 点击结算
    1判断有没有收货地址信息
    2判断用户有没有选购商品
    3经过以上的验证跳转到支付页面!

  
*/
import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting,chooseAddress,openSetting,showToast } from "../../utils/asyncWeiXin.js"
Page({
  data:{
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0,
    addressList:[],
    address:[]
  },
  onShow(){

    //存入到缓存中
    wx.setStorageSync("address",this.data.addressList);
    console.log("存入缓存"+this.data.addressList);
    //1 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];

    // 1 全选功能计算
    // every 数组方法会遍历会接收-个回调函数 那么每一个回 调函数都返回true 那么every 方法的返回值为true
    //只要有一个回调函数返回了false 那么不再循环执行，直接返回false
    // cart是空数组的话，every返回值默认是true 所以还要判断一下 
    // 为了节省性能 就不用every循环了，用下面的foreach
    // const allChecked = cart.length>0?cart.every(v=>v.checked):false;

    // 1 总价格 总数量 全选
    this.setData({address});
    this.setCart(cart);
  },
  //点击 收货地址
  async handleChooseAddress(){
    // //1 获取权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     //2 获取权限状态 主要发现一些属性名很怪异的时候 都要使用 []形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress===true || scopeAddress===undefined) {
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1);
    //         }
    //       });
    //     }else{
    //       //用户以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           //调用收货地址代码
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //               console.log(result3);
    //             },
    //           });
    //         }
    //       });
    //     }
    //    },
    // });

    try {
      //1 获取权限状态
      // const res1 = await getSetting();
      // const scopeAddress = res1.authSetting["scope.address"];
      // //2 判断权限状态
      // if (scopeAddress===false) {
      //   //3 用户以前拒绝过授予权限 先诱导用户打开授权页面
      //   await openSetting();
      // }
      //4 调用获取收货地址的api
      // let address = await chooseAddress();
      // address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;


      this.showAddressList();
    } catch (error) {
      console.log(error);
    }
  },

  //商品的选中
  handleChange(e){
    //1. 获取被修改的商品的id
    const id = e.currentTarget.dataset.id;
    //2 获取购物车数组
    let { cart } = this.data;
    //3 找到被修改的商品对象的索引
    let index = cart.findIndex(v => v.id === id);
    //4 对应索引对象的选中状态取反
    cart[index].checked = !cart[index].checked;
    
    this.setCart(cart);
  },

  //全选和反选
  handleAllCheck(e){
    //1 获取data中的数据
    let {cart,allChecked} = this.data;
    //2 修改值
    allChecked=!allChecked;
    //3 循环修改cart数组中的商品选中状态
    cart.forEach(v =>v.checked=allChecked);
    //4 把修改后的值填充回data或者缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑功能
  handleNumEdit(e){
    //1 获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart} = this.data;
    //3 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.id===id);
    //4.1判断是否要删除 购物车数量是1和用户点击“-”
    if (cart[index].num===1&&operation===-1) {
      //弹窗提示
      wx.showModal({
        title: '提示',
        content: '您是否要删除？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index,1);
            this.setCart(cart);
          }else if (result.cancel) {
            console.log('用户点击取消');
          }
        },
      });
        
    }else{
      // 4.2 进行修改数量
      cart[index].num+=operation;
      //5 设置回缓存和data中
      this.setCart(cart);
    }
    
  },

  //商品结算
  async handlePayFor(e){
    const user = wx.getStorageSync("userinfo");
    if (!user) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
      return;
    }
    // 判断收货地址
    const{addressList,totalNum} = this.data;
    if (!addressList.buyName) {
      await showToast({title:"您还没有添加收货地址呢"});
      return;
    }
    //判断用户有没有选购商品
    if (totalNum===0) {
      await showToast({title:"您还没有选购商品呢"});
      return;
    }
    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  },

  //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart){
    
      // console.log("已经存在token");
    // const userinfo =  wx.getStorageSync("userinfo");
    // if (!userinfo) {
    //   wx.navigateTo({
    //     url: '/pages/user/user',
    //   });
    //   return;
    // }
    // 1 总价格 总数量 全选
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num*v.subTitle;
        totalNum += v.num;
      }else{
        allChecked=false;
      }
    });
    //同样判断数组是否为空
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })

    wx.setStorageSync("cart", cart);
  },

  //选择收货地址
  showAddressList(res){
    wx.navigateTo({
      url: '/pages/address/address',
    });
    console.log("厉害了"+res)
  }
})