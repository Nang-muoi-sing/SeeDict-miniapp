import Taro from "@tarojs/taro";

export const setItem = (key:string, data: any) => {
  Taro.setStorageSync(key, data)
}

export const getItem = (key) => Taro.getStorageSync(key)

export const removeItem = (key) => {
  Taro.removeStorageSync(key)
}

export const cleanItem = () => {
  Taro.clearStorageSync()
}

export const openInBrowser = (url) => {
  // 复制链接到剪贴板
  Taro.setClipboardData({
    data: url,
    success() {
      // 弹窗提示用户
      Taro.showModal({
        title: '提示',
        content: '链接已复制，请打开手机浏览器（如Safari/Chrome）并粘贴访问',
        confirmText: '知道了',
        showCancel: false
      });
    },
    fail() {
      Taro.showToast({
        title: '复制失败，请手动复制',
        icon: 'none'
      });
    }
  });
}
