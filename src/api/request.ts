// src/utils/request.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import Taro from '@tarojs/taro'

// 创建自定义实例
const createService = (): AxiosInstance => {
  const service = axios.create({
    baseURL: process.env.TARO_APP_API_BASE_URL || '', // 从环境变量读取
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // 请求拦截器
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 在小程序端，如果需要可以使用 Taro 的 API
      if (process.env.TARO_ENV !== 'h5') {
        // 小程序端的特殊处理
        Taro.showLoading({
          title: '加载中...'
        })
      }

      // 添加 token
      // const token = Taro.getStorageSync('token')
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`
      // }

      return config
    },
    (error) => {
      console.error('请求错误:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      debugger
      // 隐藏 loading
      if (process.env.TARO_ENV !== 'h5') {
        Taro.hideLoading()
      }

      // 根据后端接口结构调整
      const { data } = response
      if (data.code === 200 || data.success) {
        return data
      } else {
        // 业务错误处理
        Taro.showToast({
          title: data.message || '请求失败',
          icon: 'none'
        })
        return Promise.reject(data)
      }
    },
    (error) => {
      // 隐藏 loading
      if (process.env.TARO_ENV !== 'h5') {
        Taro.hideLoading()
      }

      // 错误处理
      let message = '网络错误'
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message = '未授权，请重新登录'
            // 跳转到登录页
            Taro.navigateTo({ url: '/pages/login/index' })
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求地址不存在'
            break
          case 500:
            message = '服务器内部错误'
            break
          default:
            message = error.response.data?.message || '网络错误'
        }
      } else if (error.message.includes('timeout')) {
        message = '请求超时'
      } else if (error.message.includes('Network')) {
        message = '网络连接失败'
      }

      Taro.showToast({
        title: message,
        icon: 'none'
      })

      return Promise.reject(error)
    }
  )

  return service
}

// 导出实例
export const request = createService()

// 导出常用方法
export const get = <T = any>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
): Promise<T> => {
  return request.get(url, { ...config, params })
}

export const post = <T = any>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => {
  return request.post(url, data, config)
}

export const put = <T = any>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => {
  return request.put(url, data, config)
}

export const del = <T = any>(
  url: string,
  params?: object,
  config?: AxiosRequestConfig
): Promise<T> => {
  return request.delete(url, { ...config, params })
}

export default request
