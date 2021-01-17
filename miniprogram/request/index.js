
//同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=>{
    //每次请求加一次
    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask: true,
    });
    //定义公共的url
    const baseUrl = "http://localhost:8081/v1/api";
    return new Promise((resolve,reject)=>{
        wx.request({
        ...params,
        url:baseUrl+params.url,
        success:(result)=>{
            resolve(result);
        },
        fail:(err)=>{
            reject(err)
        },
        complete: ()=>{
            //每次请求减去一次
            ajaxTimes--;
            if(ajaxTimes===0){
                //关闭正在等待加载的图标
                wx.hideLoading();
            } 
        }
      });
    })
}