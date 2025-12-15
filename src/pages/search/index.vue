<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden home-page pt-1">
    <search-bar class="relative w-[90vw] sm:w-sm md:w-md" @on-search="onSearch"> />
    <view class="mx-auto w-[90vw] sm:w-md md:w-2xl lg:w-3xl mt-10">
      <view class="bg-wheat-300 mb-2.5 w-fit rounded-lg px-2 py-1 text-xl text-white">
        查询：{{ searchedResponse.data.queries }}
      </view>
      <view
        class="block"
        v-for="result in searchedResponse.data.results"
        @onclick="() => goDetails(result)"
        :key="result.w"
      >
        <view class="bg-wheat-100 my-5 px-5 py-4">
          <view class="text-wheat-500 flex flex-wrap justify-end gap-2 text-sm">
            <text class="flex items-center" v-if="result.refs?.length == 0 && !result.brief">
              暂未释义
            </text>
            <text
              class="flex items-center"
              v-else
              v-for="(book, index) in result.refs"
              :key="index"
            >{{ sourceMap[book] ?? '' }}</text>
          </view>
          <view class="text-rosybrown-800 xxl:text-4xl text-3xl font-bold break-all whitespace-normal">
<!--            <RubyText :text="result.text" :yngping="result.pron"></RubyText>-->
            zzzzzz
          </view>
          <p class="text-wheat-600 mt-2">
            {{ correctStops(parseText(result.brief)) }}
          </p>
        </view></view
      >
    </view>
    <Footer />
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { computed, ref } from 'vue';
import SearchBar from "@/components/SearchBar/index.vue";
import Footer from "@/components/Footer/index.vue";
import { sourceMap } from '@/utils/mapping';
import { correctStops, parseText } from '@/utils/typography';
import {search} from "@/api/api";
import './index.styl'

const queries = ref<string[]>([]);
const allResults = ref<any[]>([]);
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);

const searchedResponse = computed(() => ({
  status: 0,
  data: {
    queries: queries.value.join('、'),
    results: allResults.value,
    nextCursor: nextCursor.value,
    hasMore: hasMore.value,
  },
}));

const onSearch = async (e: any) => {
  try {
    const params = new URLSearchParams();
    params.append('q', e.target.value);
    const res = await search(params);
    console.log(res);
  }catch (e) {
    console.log(e);
  }

}
const goDetails = (data:any) => {
  Taro.navigateTo({
    url: `/pages/search/index?w=${data}`,
  })
}

</script>
