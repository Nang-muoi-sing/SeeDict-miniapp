<template>
  <view class="text-rosybrown-800 mt-2 mb-5 flex flex-wrap gap-3 rounded-lg bg-white px-8 py-6">
    <view v-if="processedData.phonologyTone">
      <Badge>音韵地位</Badge>{{ processedData.phonologyInitial
      }}{{ processedData.phonologyFinal }}{{ processedData.phonologyTone }}
    </view>
    <view v-if="processedData.banguace">
      <Badge>教会罗马字</Badge>{{ processedData.banguace }}
    </view>
    <view v-if="processedData.ipa">
      <Badge>国际音标</Badge>/{{ processedData.ipa }}/
    </view>
    <view v-if="processedData.yngping">
      <Badge>榕拼键入</Badge>
      <text v-html="makeYngpingsSup(processedData.yngping)"></text>
    </view>
    <view v-if="processedData.yngping">
      <Badge>榕拼手写</Badge>
      <text v-html="yngpingToCursive(processedData.yngping)"></text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toneCikLingMap } from '@/utils/mapping';
import {
  makeYngpingsSup,
  phonologyToBanguace,
  yngpingToCursive,
  yngpingToIPA,
} from '@/utils/phonetics';
import type { Phonetics } from '@/utils/typing';
import Badge from '@/components/Badge/index.vue';

const props = defineProps<{
  data: Phonetics;
}>();

const processedData = computed(() => {
  const toneHan = props.data.phonologyTone
    ? toneCikLingMap[props.data.phonologyTone]
    : props.data.phonologyTone;

  const ipa = yngpingToIPA(props.data.yngping);
  const banguace =
    props.data.phonologyInitial && props.data.phonologyFinal && toneHan
      ? phonologyToBanguace(
          props.data.phonologyInitial,
          props.data.phonologyFinal,
          toneHan
        )
      : '';

  return {
    ...props.data,
    phonologyTone: toneHan,
    ipa: ipa,
    banguace: banguace,
  };
});
</script>
