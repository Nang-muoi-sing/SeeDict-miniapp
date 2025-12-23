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
