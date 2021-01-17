// pages/auth/auth.js
Page({
  //获取用户信息
  handleGetUserInfo(e){
    //1 获取用户信息
    const { encryptedData, rawData, iv,signature } = e.detail;
    //2 获取小程序登录成功后的code
    wx.login({
      timeout:10000,
      success: (result)=>{
        const {code} = result;
        console.log(result);
      }
    });
  }
})