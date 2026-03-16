<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden home-page">
    <view class="flex justify-center px-4 pt-8 md:justify-end md:px-16 md:pb-0">
      <NavPanel class="relative z-30 w-xs"></NavPanel>
    </view>
    <view class="relative mx-auto flex w-fit flex-col items-center space-y-8 text-center">
      <view class="z-30 block pl-10 w-3xs"
        :style="{
          transform: `translateY(-${Math.min(scrollY * 1, 200)}px)`,
          opacity: Math.max(0, 1 - scrollY / 500),
        }"
      >
        <image alt="" src="@/assets/logo-see.svg" style="height: 400rpx" />
      </view>
    </view>
    <search-bar class="relative w-xs sm:w-sm md:w-md" :on-search="goSearch" />
    <WordsDeck />
    <Footer />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount} from 'vue'
import Footer from '@/components/Footer/index.vue';
import SearchBar from '@/components/SearchBar/index.vue';
import WordsDeck from '@/components/WordsDeck/index.vue'
import NavPanel from '@/components/NavPanel/index.vue'
import './index.styl'
import Taro from "@tarojs/taro";

const scrollY = ref(0);
const searchBarFixed = ref(false);
const navPanelFixed = ref(false);

const handleScroll = () => {
  scrollY.value = window.scrollY;
  searchBarFixed.value = scrollY.value > 200;
  navPanelFixed.value = scrollY.value > 300;
};

onMounted(() => {
  document.title = "米时典 SeeDict | 福州话词典"
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
const goSearch = (value) => {
  Taro.navigateTo({
    url: `/pages/search/index?q=${value}`,
  })
}
</script>
