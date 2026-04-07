<!-- components/PrivacyPopup/index.vue -->
<template>
  <view>
    <view @click="openPrivacyContract">test</view>
    <view v-if="visible" class="privacy-mask">
      <view class="privacy-popup">
        <view class="title">隐私保护指引</view>
        <view class="content">
          在使用本小程序服务之前，请仔细阅读
          <text class="link" @tap="openPrivacyContract">
            {{ privacyContractName }}
          </text>
          。如您同意，请点击“同意”开始使用。
        </view>
        <view class="btns">
          <button class="btn-reject" @tap="handleDisagree">拒绝</button>
          <button
            class="btn-agree"
            open-type="agreePrivacyAuthorization"
            @agreeprivacyauthorization="handleAgree"
          >
            同意
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted } from 'vue'

const visible = ref(false)
const privacyContractName = ref('《用户隐私保护指引》')
let pendingResolve: any = null


// 监听隐私授权事件（必须在 App 启动时注册）
if (Taro.onNeedPrivacyAuthorization) {
  Taro.onNeedPrivacyAuthorization((resolve: any) => {
    debugger
    // 保存 resolve 函数，等待用户点击同意/拒绝后调用
    pendingResolve = resolve
    visible.value = true
  })
}

// 打开隐私协议页面
const openPrivacyContract = () => {
  Taro.openPrivacyContract({
    fail: () => {
      Taro.showToast({ title: '打开失败', icon: 'error' })
    }
  })
}

// 同意隐私协议
const handleAgree = () => {
  visible.value = false
  if (pendingResolve) {
    pendingResolve({ buttonId: 'agree-btn', event: 'agree' })
    pendingResolve = null
  }
}

// 拒绝隐私协议
const handleDisagree = () => {
  visible.value = false
  if (pendingResolve) {
    pendingResolve({ buttonId: 'disagree-btn', event: 'disagree' })
    pendingResolve = null
  }
  // 可选：退出小程序
  // Taro.exitMiniProgram()
}

// 可选：页面启动时主动检查是否需要授权
onMounted(() => {
  Taro.getPrivacySetting({
    success: (res) => {
      if (res.needAuthorization) {
        privacyContractName.value = res.privacyContractName
        // 注意：不要在这里直接弹窗，而是等待 onNeedPrivacyAuthorization 触发
        // 如果需要主动弹窗，可以调用 Taro.requirePrivacyAuthorize()
      }
    }
  })
})
</script>

<style scoped>
.privacy-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.privacy-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 48rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32rpx;
}

.content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 48rpx;
}

.link {
  color: #07c160;
  text-decoration: underline;
}

.btns {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
}

.btn-reject,
.btn-agree {
  flex: 1;
  height: 80rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-reject {
  background: #f5f5f5;
  color: #999;
}

.btn-agree {
  background: #07c160;
  color: #fff;
}
</style>
