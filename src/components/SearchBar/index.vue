<template>
  <view class="search-bar">
    <view
      class="search-input-warp relative mx-auto mb-2 z-40 flex h-12 flex-row items-center bg-white px-3 "
    >
      <IconFont width="36"
                height="36"
                class="text-rosybrown-400 cursor-pointer pl-1 mr-2" name="search"
                @click="onSubmit"
      />
      <input
        class="text-rosybrown-800 h-full w-full mr-2 ml-1"
        @confirm="onSubmit"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { IconFont } from '@nutui/icons-vue-taro'
import './index.styl'

const props = defineProps({
  onSearch: Function,
})

const onSubmit = (e) => {
  props?.onSearch?.(e.target.value)
}

</script>
