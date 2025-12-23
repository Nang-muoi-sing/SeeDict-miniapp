<template>
  <view class="relative flex h-[40vh] min-h-[24rem] w-screen items-center justify-center overflow-hidden">
    <view
      v-for="(card, index) in deckStore.cards"
      :key="card.w"
      class="deck absolute flex touch-none items-center justify-center will-change-transform"
      :style="{
        transform: `translate3d(${springs[index]?.x || 0}px, ${springs[index]?.y || 0}px, 0)
                   scale(${springs[index]?.scale || 1})`,
      }"
    >
      <view
        @touchstart="(e) => onDragStart(index, e)"
        @touchmove="(e) => onDragMove(index, e)"
        @touchend="onDragEnd(index)"
        class="relative h-60 w-[75vw] select-none rounded-xl border-[1px] border-solid border-wheat-200 bg-rosybrown-50 p-4 lg:h-64 lg:w-[30rem]"
      >
        <view class="h-full font-sans">
          <text class="text-base italic text-wheat-400 lg:text-lg">#汝会仈儥？</text>
          <view class="flex flex-col items-center space-y-5">
            <view
              class="whitespace-normal break-all text-3xl font-bold text-rosybrown-800 md:text-4xl lg:text-5xl"
              @click="goWord(card.w)"
            >
              <RubyText :text="card.text" :yngping="card.pron"></RubyText>
            </view>
            <p
              class="line-clamp-4 max-w-lg overflow-hidden text-ellipsis whitespace-normal text-base text-rosybrown-800 lg:line-clamp-2 lg:text-lg"
            >
              释义：{{ card.expl }}
            </p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import { onMounted, reactive, ref, watch } from 'vue';
import { useDeckStore } from '@/store/deckStore';
import RubyText from '@/components/RubyText/index.vue';
import './index.styl'

const deckStore = useDeckStore();

type Spring = {
  x: number;
  y: number;
  scale: number;
};

const springs = reactive<Spring[]>([]);
const currentDraggingIndex = ref<number | null>(null);
const startX = ref(0);
const movementX = ref(0);
const startTime = ref(0);



// 初始化弹簧动画
const initSprings = (): void => {
  springs.length = 0; // 清空旧动画数据

  deckStore.cards.forEach((_, index) => {
    // 判断卡片是否已被标记为 gone
    const isGone = deckStore.gone.has(index);

    springs.push({
      x: isGone
        ? index % 2 === 0
          ? -window.innerWidth - 200
          : window.innerWidth + 200
        : index * 4,
      y: isGone ? 0 : index * 4,
      scale: 1,
    });
  });

};

// 拖动开始：过滤已移除的卡片
const onDragStart = (index: number, e:any): void => {
  if (deckStore.gone.has(index)) return; // 已移除的卡片不响应拖动
  currentDraggingIndex.value = index;
  startX.value = e.touches[0].clientX;
  movementX.value = 0;
  startTime.value = Date.now();
  springs[index].scale = 1.1;
};

// 拖动移动：判断卡片是否已移除
const onDragMove = (index: number, e:any): void => {
  if (currentDraggingIndex.value !== index || deckStore.gone.has(index)) return;
  const clientX = e.touches[0].clientX;
  movementX.value = clientX - startX.value;
  springs[index].x = movementX.value; // 实时更新位置
};

// 拖动结束：调用 Store 标记已移除，所有卡片移除后请求新数据
const onDragEnd = (index: number): void => {
  if (currentDraggingIndex.value !== index || deckStore.gone.has(index)) return;

  const endTime = Date.now();
  const elapsedTime = endTime - startTime.value;
  const velocity = Math.abs(movementX.value) / elapsedTime;
  const trigger = velocity > 0.002;
  const dir = movementX.value < 0 ? -1 : 1;

  if (trigger) {
    deckStore.addGoneIndex(index);
    springs[index].x = 1000
    if (deckStore.gone.size === deckStore.cards.length) {
      deckStore.fetchDeck();
    }
  } else {
    // 未触发移除，回弹到初始位置
    springs[index].x = 0
    springs[index].scale = 1;
  }
  currentDraggingIndex.value = null;
};
const goWord = (w) => {
  Taro.navigateTo({
    url: `/pages/word/index?w=${w}`,
  })
}

onMounted(() => {
  if (deckStore.cards.length === 0) {
    deckStore.fetchDeck();
  } else {
    initSprings();
  }
});

watch(
  () => deckStore.cards,
  (newCards) => {
    if (newCards.length > 0) {
      initSprings();
    }
  },
  { deep: true }
);
</script>
