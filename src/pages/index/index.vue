<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden home-page">
    <view class="relative mx-auto mt-5 flex w-fit flex-col items-center space-y-8 text-center">
      <view class="z-30 block pl-10 w-3xs"
        :style="{
          transform: `translateY(-${Math.min(scrollY * 1, 200)}px)`,
          opacity: Math.max(0, 1 - scrollY / 500),
        }"
      >
        <image alt="" src="@/assets/logo-see.svg" />
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
