<template>
  <view class="word-head">
    <view
      class="relative z-10 mb-8 mt-5 cursor-pointer overflow-hidden rounded-lg bg-wheat-100 px-8 py-6 transition-all duration-300 ease-in-out before:absolute before:left-[100%] before:top-[100%] before:-z-10 before:h-[100rem] before:w-[100rem] before:rounded-full before:bg-wheat-200 before:transition-all before:duration-700 before:content-[''] active:before:-left-[16rem] active:before:-top-[16rem] active:before:transition-colors active:before:duration-0 md:hover:before:-left-[16rem] md:hover:before:-top-[16rem]"
      :class="isAudioClicking ? '' : 'active:scale-95'"
      @click.prevent="handleCopyClick"
    >
      <view class="flex flex-row items-center gap-5 whitespace-normal break-all text-4xl font-bold text-rosybrown-800 md:text-5xl">
        <RubyText :text="props.text" :yngping="props.yngping" />
        <view
          v-if="props.voiceUrl"
          @click.stop.prevent="handleAudioClick"
          @mousedown.stop="isAudioClicking = true"
          @mouseup.stop="isAudioClicking = false"
          class="relative z-10"
        >
          <IconFont
            size="48"
            class="cursor-pointer text-wheat-600/60 transition-colors"
            name="play-start"
          />
        </view>
      </view>
    </view>
    <view ref="copyTip" class="fixed bottom-0 left-0 right-0 z-50 -mb-12 flex justify-center">
      <view class="flex flex-row items-center gap-1 rounded-lg bg-white px-6 py-3 font-medium text-wheat-800 shadow-lg">
        已复制词条
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, {} from "@tarojs/taro";
import { ref, watch } from 'vue';
import RubyText from '@/components/RubyText/index.vue';
import {IconFont} from "@nutui/icons-vue-taro";
import './index.styl'

const props = defineProps<{
  text: string;
  yngping: string;
  voiceUrl?: any;
}>();
const innerAudioContext = Taro.createInnerAudioContext()

innerAudioContext.onEnded(() => {
  isPlaying.value = false;
  innerAudioContext.seek(0)
})

watch(
  () => props.voiceUrl,
  (newVal, oldVal) => {
    if((oldVal !== newVal) && newVal) innerAudioContext.src = newVal
  }
)


const copyTip = ref<HTMLElement | null>(null);
const isPlaying = ref(false);
const isAudioClicking = ref(false);

const handleCopyClick = async () => {
  try {
    await Taro.setClipboardData({
      data: props.text.replace(/\*/g, '')
    });
    Taro.showToast({
      title: '已复制词条',
      icon: 'success',
      duration: 2000,
    })
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const handleAudioClick = () => {
  if (!innerAudioContext) return;
  if (isPlaying.value) {
    innerAudioContext.pause();
  } else {
    innerAudioContext.play()
  }
  isPlaying.value = !isPlaying.value;


};
</script>
