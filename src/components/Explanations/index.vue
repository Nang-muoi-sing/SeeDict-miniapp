<template>
  <view>
    <ExplNodeList
      :nodes="props.data"
      :path="[]"
      :currentGlyph="props.currentGlyph"
    />
  </view>
</template>

<script setup lang="ts">
import ExplNodeList from './ExplNodeList.vue';
import type { FengExplNode } from '@/utils/typing';

interface Props {
  data: FengExplNode[];
  currentGlyph?: 'first' | 'second';
}

const props = withDefaults(defineProps<Props>(), {
  currentGlyph: 'second',
});
</script>
