<template>
  <view class="search-bar">
    <view
      class="search-input-warp relative mx-auto mb-2 z-40 flex h-12 flex-row items-center bg-white px-3 "
    >
      <IconFont width="36"
                height="36"
                class="text-rosybrown-400 cursor-pointer pl-1 mr-2" name="search" />
      <input
        class="text-rosybrown-800 h-full w-full mr-2 ml-1"
        @blur="onSearch"
      />
    </view>
    <view class="search-card-list">

      <!--      <ul
              v-show="isHistoryVisible && filteredHistory.length > 0"
              class="outline-rosybrown-300 absolute top-full right-0 left-0 rounded-b-md bg-white pt-2 outline outline-1"
            >
              <li
                v-for="(history, index) in filteredHistory"
                :key="index"
                class="hover:text-rosybrown-700 box-border flex flex-row items-center justify-between border-l-4 px-4 py-1 transition-colors duration-150"
                :class="[
                  index === selectedIndex
                    ? 'border-l-rosybrown-700 bg-rosybrown-50 text-rosybrown-700'
                    : 'border-l-transparent',
                ]"
                @mouseenter="handleMouseEnter(index)"
                @mouseleave="handleMouseLeave"
              >
                <div
                  class="flex w-5/6 cursor-pointer flex-row items-center font-sans"
                  @click.stop="selectHistory(index)"
                >
                  <i-material-symbols-history-rounded
                    class="text-rosybrown-400 pr-4"
                    style="width: 40px"
                  />
                  <div class="text-rosybrown-600 overflow-hidden text-ellipsis">
                    {{ history }}
                  </div>
                </div>
                <div
                  class="text-rosybrown-300 hover:text-rosybrown-500 cursor-pointer text-sm hover:underline"
                  @click.stop="deleteHistory(index)"
                >
                  删除
                </div>
              </li>
              <li
                v-show="isHistoryVisible && filteredHistory.length > 0"
                class="flex flex-row-reverse items-baseline px-4 py-1"
              >
                <div
                  class="text-rosybrown-300 hover:text-rosybrown-500 cursor-pointer text-xs"
                  @click.stop="clearHistory"
                >
                  清空历史
                </div>
              </li>
            </ul>-->
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Taro,{ navigateTo } from '@tarojs/taro'
import { IconFont } from '@nutui/icons-vue-taro'
import { useDebounceFn } from '@vueuse/core';
import { Trie } from '@/utils/trie';
import './index.styl'
import {search} from "@/api/api";

const onSearch = async (e: any) => {
  try {
    debugger
    const res = await search({ params: { q: e.target.value }});
    console.log(res);
  }catch (e) {
    console.log(e);
  }

}


</script>
