<template>
  <view class="search-bar">
    <view :class="['search-input-warp relative mx-auto mb-2 z-40 flex h-12 flex-row items-center bg-white px-3',
                  { 'focus-search': isHistoryVisible && filteredHistory.length > 0 }]">
      <image
        class="search-icon"
        src="@/assets/icon/search.svg"
        alt=""
        @click="onSubmit"
      />
      <input
        class="text-rosybrown-800 h-full w-full mr-2 ml-1"
        :value="searchValue"
        @confirm.stop.prevent="onSubmit"
        @focus.stop.prevent="showHistory"
        @blur.stop.prevent="hideHistory"
      />
      <view
        v-show="isHistoryVisible && filteredHistory.length > 0"
        class="outline-rosybrown-300 absolute top-full right-0 left-0 rounded-b-md bg-white pt-2 outline outline-1"
      >
        <view
          v-for="(history, index) in filteredHistory"
          :key="index"
          class="hover:text-rosybrown-700 box-border flex flex-row items-center justify-between border-l-4 px-4 py-1 transition-colors duration-150"
          :class="[
            index === selectedIndex
              ? 'border-l-rosybrown-700 bg-rosybrown-50 text-rosybrown-700'
              : 'border-l-transparent',
          ]"
        >
          <view
            class="flex w-5/6 flex-row items-end font-sans"
            @click.stop.prevent="selectHistory(index)"
          >
            <image
              class="search-icon pr-4"
              src="@/assets/icon/clock-arrow.svg"
              alt=""
            />
            <view class="text-rosybrown-600 overflow-hidden text-ellipsis text-sm">
              {{ history }}
            </view>
          </view>
          <view
            class="text-rosybrown-300 cursor-pointer text-sm"
            @click.stop.prevent="deleteHistory(index)"
          >
            删除
          </view>
        </view>
        <view
          v-show="isHistoryVisible && filteredHistory.length > 0"
          class="flex flex-row-reverse items-baseline px-4 py-1"
        >
          <view
            class="text-rosybrown-300 hover:text-rosybrown-500 cursor-pointer text-xs"
            @click.stop="clearHistory"
          >
            清空历史
          </view>
        </view>
      </view>
    </view>
    <view v-if="showBtn">
      <Horizontal color="red" @click="openPopup" />
      111
      <nut-popup v-model:visible="showPopup" position="right" :style="{ width: '20%', height: '100%' }"></nut-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getItem, setItem, removeItem } from '@/utils/utils'
import { Horizontal } from '@nutui/icons-vue-taro'
import { useRouter, eventCenter } from '@tarojs/taro'
import './index.styl'

const router = useRouter()

const HISTORY_KEY = 'searchHistory'
const props = defineProps({
  onSearch: Function,
})

const searchValue = ref('');
const isHistoryVisible = ref(false);
const filteredHistory = ref<string[]>([]);
const selectedIndex = ref(-1);
const showPopup = ref(false);


const showHistory = () => {
  filteredHistory.value = getItem(HISTORY_KEY)
  isHistoryVisible.value = true
}
const hideHistory = () => {
  isHistoryVisible.value = false
}
const setItemData = (value) => {
  let data = getItem(HISTORY_KEY)
  if(data && data.length > 0) {
    if(data.some(item =>  item === value)) {
      data = data.filter(item => item !== value)
    }
    data.unshift(value)
    setItem(HISTORY_KEY, data)
  } else {
    setItem(HISTORY_KEY, [value])
  }
}
const onSubmit = (e) => {
  isHistoryVisible.value = false
  const { value } = e.target
  searchValue.value = value
  if(value) {
    props?.onSearch?.(value)
    setItemData(value)
  }
}

const deleteHistory = (index: number) => {
  const data = getItem(HISTORY_KEY)
  data.splice(index, 1)
  if (index === selectedIndex.value) {
    selectedIndex.value = -1;
  }
  setItem(HISTORY_KEY, data)
  filteredHistory.value = data
};

const clearHistory = () => {
  filteredHistory.value = [];
  removeItem(HISTORY_KEY)
  selectedIndex.value = -1;
};

const selectHistory = (index: number) => {
  onSubmit({ target: { value: filteredHistory.value[index] } });
};

const openPopup = () => {
  showPopup.value = true
  eventCenter.trigger('openPopup')
}

const showBtn = computed(() => {
  return router.path.indexOf('index/index') === -1
})
</script>
