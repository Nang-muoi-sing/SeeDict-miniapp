<template>
  <view class="text-rosybrown-800 mt-2 mb-5 rounded-lg bg-white px-8 py-6">
    <view class="items-baseline">
      <text class="text-rosybrown-800 mr-2 text-3xl font-bold sm:text-4xl">
        {{ props.data.text }}
      </text>
      <text class="text-rosybrown-500 text-xl">
        /{{ yngpingToIPA(props.data.pronLiteral, true) }}/→/{{
          yngpingToIPA(props.data.pronSandhi, true)
        }}/
      </text>
    </view>

    <view class="flex w-full justify-end">
      <view
        class="bg-wheat-50 hover:bg-wheat-100 mb-4 cursor-pointer rounded px-3 py-1 text-sm transition"
        @click="toggleMode"
      >
        显示{{ currentGlyph === 'first' ? '推荐用字' : '原书用字' }}
      </view>
    </view>
    <Explanations
      :data="props.data.expls"
      :current-glyph="currentGlyph"
    ></Explanations>
    <view v-if="props.data.comment">
      <text class="text-rosybrown-700 see-symbol">注釋</text>
      {{ parseText(props.data.comment, currentGlyph) }}
    </view>
    <view class="text-rosybrown-200 mt-2 flex justify-end text-sm">
      {{
        props.data.refPage
          ? `冯爱珍. 福州方言词典. 南京: 江苏教育出版社, 1998: ${props.data.refPage}.`
          : '冯爱珍. 福州方言词典. 南京: 江苏教育出版社, 1998.'
      }}
    </view>
    <view v-if="props.data.correction">
      <view class="border-rosybrown-100 my-2 border-t-2" />
      <view>
        <text class="text-rosybrown-700 see-symbol">校注</text>
        {{ correctText(props.data.correction) }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { yngpingToIPA } from '@/utils/phonetics';
import type { WordFeng } from '@/utils/typing';
import { parseText, correctText } from '@/utils/typography';
import Explanations from '@/components/Explanations/index.vue'


const props = defineProps<{
  data: WordFeng;
}>();

const currentGlyph = ref<'first' | 'second'>('second');
const toggleMode = () => {
  currentGlyph.value = currentGlyph.value === 'first' ? 'second' : 'first';
};
</script>
