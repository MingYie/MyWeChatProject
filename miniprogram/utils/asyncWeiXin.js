/**
 *  promise形式的 getSetting
 *  导出函数 resolve成功的回调 reject失败的回调
 */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
        });
    })
}

/**
 * promise形式的 chooseAddress
 */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
        });
    })
}

/**
 * promise形式的 openSetting
*/
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
        });
    })
}


/**
 * promise形式的 showToast
*/
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
        });
    })
}




