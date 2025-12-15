// 封装 Taro.request
import Taro from '@tarojs/taro'
// import { getStorage } from './storage'

const request = (options) => {
  const { url, method = 'GET', data, header = {} } = options

  // 添加通用 header
  const defaultHeader = {
    'Content-Type': 'application/json',
    // 'Authorization': getStorage('token') || ''
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: `https://seedict.com${url}`,
      method: method.toUpperCase(),
      data,
      header: { ...defaultHeader, ...header },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 使用示例
export const api = {
  get: (url, data) => request({ url, method: 'GET', data }),
  post: (url, data) => request({ url, method: 'POST', data }),
  put: (url, data) => request({ url, method: 'PUT', data }),
  delete: (url, data) => request({ url, method: 'DELETE', data })
}
