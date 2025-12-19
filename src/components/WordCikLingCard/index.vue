<template>
  <view
    v-if="processedEntries?.length > 0"
    class="mt-2 mb-5 rounded-lg bg-white px-8 py-6"
  >
    <view class="mb-2 space-y-2">
      <WordCikLingEntry
        v-for="(cikling, index) in processedEntries"
        :data="cikling"
        :key="index"
      />
    </view>
    <view class="text-rosybrown-800 space-y-1">
      <view v-for="liAnnotation in processedLiAnnotations">
        <Badge v-for="liAnnotationOrder in liAnnotation.order">
          {{liAnnotationOrder }}
        </Badge>
        {{ liAnnotation.content }}
      </view>
    </view>

    <view class="text-rosybrown-200 mt-2 flex justify-end text-sm">
      李如龙, 王升魁. 戚林八音校注. 福州: 福建人民出版社, 2001.
    </view>
    <view v-if="props.isCommentedCikLing">
      <view class="border-rosybrown-100 my-2 border-t-2" />
      <view class="text-rosybrown-800 space-y-1">
        <view v-for="(cikling, index) in processedEntries" :key="index">
          <view v-if="cikling.comment">
            <text class="text-rosybrown-700 see-symbol">校注</text>
            {{ correctText(cikling.comment) }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toneCikLingMap } from '@/utils/mapping';
import type { WordCikLing } from '@/utils/typing';
import { correctText } from '@/utils/typography';
import Badge from '@/components/Badge/index.vue';
import WordCikLingEntry from './WordCikLingEntry.vue';

const props = defineProps<{
  data: WordCikLing[];
  isCommentedCikLing: boolean;
}>();

const processedEntries = computed(() => {
  return props.data.map((item) => {
    const tone = toneCikLingMap[item.tone];

    return {
      ...item,
      tone,
    };
  });
});

interface CikLingLiAnnotation {
  content: string;
  order: Set<string>;
}

const processedLiAnnotations = computed(() => {
  const annotationGroups: Record<string, CikLingLiAnnotation> = {};

  props.data.forEach((item) => {
    const cikOrder = `${item.cikFinal} ${item.liAnnotateCikOrder}`;
    const lingOrder = `${item.lingFinal} ${item.liAnnotateLingOrder}`;

    if (item.liAnnotateCik) {
      if (!annotationGroups[item.liAnnotateCik]) {
        annotationGroups[item.liAnnotateCik] = {
          content: item.liAnnotateCik,
          order: new Set([cikOrder]),
        };
      } else {
        annotationGroups[item.liAnnotateCik].order.add(cikOrder);
      }
    }

    if (item.liAnnotateLing) {
      if (!annotationGroups[item.liAnnotateLing]) {
        annotationGroups[item.liAnnotateLing] = {
          content: item.liAnnotateLing,
          order: new Set([lingOrder]),
        };
      } else {
        annotationGroups[item.liAnnotateLing].order.add(lingOrder);
      }
    }
  });

  return Object.values(annotationGroups).map((group) => ({
    content: removeNumber(group.content),
    order: Array.from(group.order),
  }));
});

const removeNumber = (str: string) => {
  return str.replace(/\d+$/, '').trim();
};
</script>
