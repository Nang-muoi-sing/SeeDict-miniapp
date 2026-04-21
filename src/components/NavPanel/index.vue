<template>
  <view class="flex h-full flex-row justify-between rounded-lg bg-white">
    <view
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <view>主页</view>
    </view>
    <view
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <view @click="openInBrowser('https://seedict.com/tutorial')" >入门</view>
    </view>
    <view
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <view
        @click="openInBrowser('https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc')"
        >
        帮助
      </view>
    </view>
    <view
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <view @click="openInBrowser('https://seedict.com/tool')" >工具</view>
    </view>
    <view
      class="hover:bg-wheat-50 text-rosybrown-600 hover:text-rosybrown-800 m-1 content-center rounded-xs px-3 py-1.5 font-bold transition-all ease-in-out"
    >
      <view @click="openInBrowser('https://seedict.com/about')" >关于</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {openInBrowser} from "@/utils/utils";
</script>
