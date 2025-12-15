<template>
  <view class="absolute bottom-0 bg-wheat-50 footer">
    <view class="bg-rosybrown-800 h-56 rounded-t-[48px] text-center">
      <view class="flex flex-col pt-20">
        <text class="text-sans text-rosybrown-50 mb-2">© 2025 米时典 SeeDict
        </text>
        <view v-if="showBeiAn" class="text-rosybrown-400 text-sm mx-auto gap-x-5 gap-y-0.5 flex flex-col md:flex-row">
          <text>闽 ICP 备 2025111999 号 - 1</text>
          <text>闽公网安备 35010202001966 号</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import './index.styl'
const showBeiAn = true // import.meta.env.VITE_ENV_NAME !== 'github-ci';
</script>
