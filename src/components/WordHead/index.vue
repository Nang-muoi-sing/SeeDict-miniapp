<template>
  <view class="word-head">
    <div
      class="relative z-10 mb-8 mt-5 cursor-pointer overflow-hidden rounded-lg bg-wheat-100 px-8 py-6 transition-all duration-300 ease-in-out before:absolute before:left-[100%] before:top-[100%] before:-z-10 before:h-[100rem] before:w-[100rem] before:rounded-full before:bg-wheat-200 before:transition-all before:duration-700 before:content-[''] active:before:-left-[16rem] active:before:-top-[16rem] active:before:transition-colors active:before:duration-0 md:hover:before:-left-[16rem] md:hover:before:-top-[16rem]"
      :class="isAudioClicking ? '' : 'active:scale-95'"
      @click.prevent="handleCopyClick"
    >
      <div
        class="flex flex-row items-baseline gap-5 whitespace-normal break-all text-4xl font-bold text-rosybrown-800 md:text-5xl"
      >
        <RubyText :text="props.text" :yngping="props.yngping"></RubyText>
        <div
          v-if="props.voiceUrl"
          @click.stop="handleAudioClick"
          @mousedown.stop="isAudioClicking = true"
          @mouseup.stop="isAudioClicking = false"
          @mouseleave.stop="isAudioClicking = false"
          class="relative z-10"
        >
          <audio
            ref="audioPlayer"
            :src="props.voiceUrl"
            preload="auto"
            class="hidden"
          ></audio>
          <i-material-symbols-play-circle-rounded
            class="cursor-pointer text-wheat-600/60 transition-colors hover:text-wheat-600"
          />
        </div>
      </div>
    </div>
    <view ref="copyTip" class="fixed bottom-0 left-0 right-0 z-50 -mb-12 flex justify-center">
      <view class="flex flex-row items-center gap-1 rounded-lg bg-white px-6 py-3 font-medium text-wheat-800 shadow-lg">
        已复制词条
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RubyText from '@/components/RubyText/index.vue';
import './index.styl'


const props = defineProps<{
  text: string;
  yngping: string;
  voiceUrl?: string;
}>();

const copyTip = ref<HTMLElement | null>(null);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const isAudioClicking = ref(false);

const handleCopyClick = async () => {
  try {
    const textToCopy = props.text.replace(/\*/g, '');
    await navigator.clipboard.writeText(textToCopy);

  } catch (err) {
    console.error('复制失败:', err);
  }
};

const handleAudioClick = () => {
  if (!audioPlayer.value) return;

  if (isPlaying.value) {
    audioPlayer.value.pause();
  } else {
    audioPlayer.value.play().catch((err) => {
      console.error('播放失败:', err);
    });
  }
  isPlaying.value = !isPlaying.value;

  audioPlayer.value.onended = () => {
    isPlaying.value = false;
  };
};
</script>
