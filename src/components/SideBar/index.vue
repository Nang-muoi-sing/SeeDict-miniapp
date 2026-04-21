<template>
  <view
    class="side-bar h-full w-full max-w-xs transform flex-col bg-wheat-50"
    ref="sidebar"
  >
    <view
      class="flex cursor-pointer items-center rounded-md p-2 text-rosybrown-600 hover:text-rosybrown-800 focus:outline-none lg:hidden"
    >
      <image
        class="menu-icon"
        src="@/assets/icon/menu.svg"
        alt=""
      />
    </view>

    <view
      class="flex w-full flex-col items-center justify-center px-2 py-4 font-sans text-lg"
    >
      <image class="mb-8 logo" src="/src/assets/logo.png" draggable="false" />
      <view
        class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
      >
        <view
          class="inline-flex w-full items-center"
          @click="goto('/pages/index/index')"
        >
          <image class="mr-1 menu-title-icon" src="/src/assets/icon/home.svg" />主页</view>
      </view>
      <view
        class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
      >
        <view
          class="inline-flex w-full items-center"
          @click="openInBrowser('https://seedict.com/tutorial')"
        >
          <image class="mr-1 menu-title-icon" src="/src/assets/icon/graduationCap.svg" />入门</view
        >
      </view>
      <view
        class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
      >
        <view
          class="inline-flex w-full items-center"
          @click="openInBrowser('https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc')"
        >
          <image class="mr-1 menu-title-icon" src="/src/assets/icon/question.svg" />帮助
        </view>
      </view>
      <view
        class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
      >
        <view class="inline-flex w-full items-center" @click="openInBrowser('https://seedict.com/tool')">
          <image class="mr-1 menu-title-icon" src="/src/assets/icon/toolsIcon.svg" />工具
        </view>
      </view>
      <view
        class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
      >
        <view
          class="inline-flex w-full items-center"
          @click="openInBrowser('https://seedict.com/about')"
        >
          <image class="mr-1 menu-title-icon" src="/src/assets/icon/aboutIcon.svg" />关于</view
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, {} from "@tarojs/taro";
import './index.styl'
import {openInBrowser} from "@/utils/utils";

const goto = (url) => {
  Taro.navigateTo({
    url,
  })
}
</script>
