<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden pt-1 search-page">
    <search-bar class="relative w-[90vw] sm:w-sm md:w-md" :on-search="onSearch" />
    <view class="mx-auto w-[90vw] sm:w-md md:w-2xl lg:w-3xl mt-10 mb-10">
      <view class="bg-wheat-300 mb-2.5 w-fit rounded-lg px-2 py-1 text-xl text-white">
        查询：{{ searchedResponse.data.queries }}
      </view>
      <view
        class="block"
        v-for="result in searchedResponse.data.results"
        @click="() => goDetails(result.w)"
        :key="result.w"
      >
        <view class="bg-wheat-100 my-5 px-5 py-4">
          <view class="text-wheat-500 flex flex-wrap justify-end gap-2 text-sm">
            <text class="flex items-center" v-if="result.refs?.length == 0 && !result.brief">
              暂未释义
            </text>
            <view
              class="flex items-center"
              v-else
              v-for="(book, index) in result.refs"
              :key="index"
            >
              <image class="icon-img" src="@/assets/icon/book.svg" />
              <text>{{ sourceMap[book] ?? '' }}</text>
            </view>
          </view>
          <view class="text-rosybrown-800 xxl:text-4xl text-3xl font-bold break-all whitespace-normal">
            <RubyText :text="result.text" :yngping="result.pron" />
          </view>
          <text class="text-wheat-600 mt-2">
            {{ correctStops(parseText(result.brief)) }}
          </text>
        </view>
      </view>
      <view class="text-wheat-400 mt-6 text-center text-sm">
        没有找到想找的词汇？尝试
        <view
          class="underline underline-offset-4 transition-all inline-block"
          @click.stop="() => openUrl('https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnfDrtD7nlpJdryFlYFUU3Lf')"
        >
          向我们反馈
        </view>
        或
        <view
          @click.stop="() => openUrl('https://jcnf40n3hvft.feishu.cn/share/base/form/shrcnAQ3W3DjmPV7ycTJ1ekiFBf')"
          class="underline underline-offset-4 transition-all inline-block"
        >
          向我们提交数据
        </view>
      </view>

      <view v-if="hasMore" class="mt-6 text-center">
        <view
          @click="loadMore"
          class="bg-wheat-300 hover:bg-wheat-400 disabled:bg-wheat-200 rounded-lg px-6 py-3 text-white"
        >
          <text class="animate-bounce">加载更多</text>
        </view>
      </view>
      <view
        v-if="!hasMore && allResults.length > 0"
        class="text-wheat-500 mt-6 text-center"
      >
        已显示所有 {{ allResults.length }} 条相关结果
      </view>
    </view>
    <Footer />
  </view>
</template>

<script setup lang="ts">
import Taro, { useLoad } from "@tarojs/taro";
import { computed, ref, watch } from 'vue';
import SearchBar from "@/components/SearchBar/index.vue";
import Footer from "@/components/Footer/index.vue";
import RubyText from '@/components/RubyText/index.vue';
import { sourceMap } from '@/utils/mapping';
import { correctStops, parseText } from '@/utils/typography';
import {search} from "@/api/api";
import {IconFont} from "@nutui/icons-vue-taro";
import './index.styl'


const queries = ref<string[]>([]);
const allResults = ref<any[]>([]);
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);

let q: string = ref<string>('');



useLoad((option) => {
  if(option.q) onSearch(option.q);
})

const searchedResponse = computed(() => ({
  status: 0,
  data: {
    queries: queries.value.join('、'),
    results: allResults.value,
    nextCursor: nextCursor.value,
    hasMore: hasMore.value,
  },
}));


const onSearch = async (value: string) => {
  try {
    q.value = value
    const params = new URLSearchParams();
    params.append('q', value);
    Taro.showLoading()
    const { status, data } = await search(params);
    if(status === 200) {
      queries.value = data.queries || []
      allResults.value = data.results || [];
      nextCursor.value = data.nextCursor || null;
      hasMore.value = data.hasMore || false;
    }
  }catch (e) {
    console.log(e);
  }finally {
    Taro.hideLoading()
  }

}
const loadMore = async () => {
  if (!nextCursor.value) return;

  try {
    const params = new URLSearchParams();
    params.append('q', q.value);
    params.append('cursor', nextCursor.value!);
    Taro.showLoading()
    const { status, data } = await search(params);
    if(status === 200) {
      allResults.value = [...allResults.value, ...(data.results || [])];
      nextCursor.value = data.nextCursor || null;
      hasMore.value = data.hasMore || false;
    }
  } catch (error) {
    console.error('加载更多失败:', error);
  } finally {
    Taro.hideLoading()
  }
};
const goDetails = (data:string) => {
  Taro.navigateTo({
    url: `/pages/word/index?w=${data}`,
  })
}
const openUrl = (url:string) => {
  Taro.setClipboardData({
    data: url,
    success: () => {
      Taro.showToast({
        title: '链接已复制，请手动打开浏览器并粘贴链接',
        icon: 'success'
      })
    },
    fail: (err) => {
      console.error('复制失败:', err)
      Taro.showToast({
        title: '复制失败',
        icon: 'error'
      })
    }
  })
}
</script>
