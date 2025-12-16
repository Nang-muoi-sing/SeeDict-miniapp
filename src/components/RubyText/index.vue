<template>
  <view class="ruby-text">
    <view class="ruby-content" v-if="!props.text || !props.yngping || !isMatchedTextSyllable">
      <text class="relative top-[0.5em] text-rosybrown-700">
        {{makeYngpingsCursive(props.yngping) ?? '' }}
      </text>
      <view v-if="props.text">
        <text
          v-for="(char, index) in baldChars"
          :key="`${char}-${index}`"
          class="rb relative inline-block"
          :class="{
          'w-fit after:absolute after:-bottom-[0.2em] after:left-1/2 after:h-[0.15em] after:w-[0.15em] after:-translate-x-1/2 after:rounded-full after:bg-rosybrown-700 after:content-[\'\']':
            markedChars[index],
        }"
        >{{ char }}
        </text>
      </view>
      <text v-else class="rb"></text>
    </view>
    <view class="ruby-content" v-else>
      <view class="ruby-text-content" v-for="(char, index) in baldChars" :key="`${char}-${index}`">
        <view v-if="baldChars.length > 1" class="rt text-rosybrown-700">
          {{makeYngpingCursive(syllables[index])}}
        </view>
        <view v-else class="rt text-rosybrown-700">
          {{makeYngpingCursive(syllables[index]) }}
        </view>
        <view
          class="inline-block"
          :class="{'w-fit after:absolute after:-bottom-[0.2em] after:left-1/2 after:h-[0.15em] after:w-[0.15em] after:-translate-x-1/2 after:rounded-full after:bg-rosybrown-700 after:content-[\'\']':
          markedChars[index],}"
        >
          {{ char }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { makeYngpingCursive, makeYngpingsCursive } from '@/utils/phonetics';
import { computed } from 'vue';
import './index.styl'

const props = defineProps<{
  text: string;
  yngping: string;
}>();

const rawText = computed(() => props.text.trim());
const rawYngping = computed(() => props.yngping.trim());

const markedChars = computed<boolean[]>(() => {
  const chars = rawText.value.split(/(?:)/u);
  const marks:any[] = [];

  for (let index = 0; index < chars.length; index++) {
    if (chars[index] === '*') {
      continue;
    }

    if (index === chars.length - 1) {
      marks.push(false);
      continue;
    }

    if (chars[index + 1] === '*') {
      marks.push(true);
    } else {
      marks.push(false);
    }
  }
  return marks;
});

const baldText = computed(() => rawText.value.replace(/\*/g, ''));
const baldChars = computed(() => baldText.value.split(/(?:)/u));
const syllables = computed(() => rawYngping.value.split(' '));

const isMatchedTextSyllable = computed(() => {
  return baldChars.value.length === syllables.value.length;
});
</script>
