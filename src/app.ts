import Taro from "@tarojs/taro";
import { createApp } from 'vue'
import './app.styl'
import "@nutui/nutui-taro/dist/style.css";
import { IconFont } from '@nutui/icons-vue-taro'
import NutUI from '@nutui/nutui-taro'
import { createPinia } from 'pinia';



const App = createApp({
  onShow () {
    console.log('App onShow.')
    Taro.setInnerAudioOption({
      obeyMuteSwitch: false
    })
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
// @ts-ignore
App.use(IconFont)
App.use(NutUI)
App.use(createPinia())
export default App
