<template>
  <view
    class="fixed inset-0 z-50 flex lg:hidden"
  >
    <view
      class="backdrop-blur-xs fixed inset-0 backdrop-brightness-90"
      ref="backdrop"
    ></view>

    <view
      class="absolute right-0 top-0 h-full w-full max-w-xs transform flex-col bg-wheat-50"
      ref="sidebar"
    >
      <view
        class="flex cursor-pointer items-center rounded-md p-2 text-rosybrown-600 hover:text-rosybrown-800 focus:outline-none lg:hidden"
      >
        <image
          class="search-icon"
          src="@/assets/icon/menu.svg"
          alt=""
        />
      </view>

      <view
        class="flex w-full flex-col items-center justify-center px-2 py-4 font-sans text-lg"
      >
        <image class="mb-8" src="/src/assets/logo.png" draggable="false" />
        <view
          class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
        >
          <view
            class="inline-flex w-full items-center"
          >
            <i-material-symbols-home-rounded class="mr-1" />主页</view>
        </view>
        <view
          class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
        >
          <view
            class="inline-flex w-full items-center"
          >
            <i-material-symbols-school-rounded class="mr-1" />入门</view
          >
        </view>
        <view
          class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
        >
          <text
            class="inline-flex w-full items-center"
            href="https://jcnf40n3hvft.feishu.cn/docx/FSqidtsgjo25x0x6R1KcChopnTc"
            target="_blank"
          ><i-material-symbols-help-rounded class="mr-1" />帮助</text
          >
        </view>
        <view
          class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
        >
          <view
            class="inline-flex w-full items-center"
          >
            <i-lucide-tool-case class="mr-1" />工具</view
          >
        </view>
        <view
          class="rounded-xs m-1 w-full content-center px-3 py-1.5 align-middle font-bold text-rosybrown-600 transition-all ease-in-out hover:bg-wheat-100 hover:text-rosybrown-800"
        >
          <view
            class="inline-flex w-full items-center"
          >
            <i-material-symbols-crowdsource class="mr-1" />关于</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
</script>
