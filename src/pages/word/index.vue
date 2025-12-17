<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden home-page">
    <search-bar class="relative w-[90vw] sm:w-sm md:w-md" :on-search="goSearch" />
    <view class="mx-auto w-[90vw] sm:w-md md:w-2xl lg:w-3xl mt-10 mb-10">
      <view
        v-if="
          (wordResponse.data.result.seedict.expls.length > 0 &&
            wordResponse.data.result.seedict.expls[0].expl) ||
          wordResponse.data.result.seedict.commentExpl
        "
      >
        <view class="border-rosybrown-800 text-rosybrown-800 w-fit border-t-[6px] p-1 text-xl font-bold">
          本站释义
        </view>
        "注音一览"
        <div class="mb-5 mt-2 rounded-lg bg-white px-8 py-6 text-rosybrown-800">
          <Explanations
            :data="wordResponse.data.result.seedict.expls"
          ></Explanations>
          <view v-if="wordResponse.data.result.seedict.commentExpl">
            <SeeSymbol class="text-rosybrown-700">注釋</SeeSymbol
            >{{ correctText(wordResponse.data.result.seedict.commentExpl) }}
          </view>
          <view
            v-if="
              wordResponse.data.result.seedict.synonym ||
              wordResponse.data.result.seedict.antonym
            "
          >
            <hr class="my-2 border-t-2 border-rosybrown-100" />
            <div class="space-y-1">
              <p v-if="wordResponse.data.result.seedict.synonym">
                <SeeSymbol class="text-rosybrown-700">近義詞</SeeSymbol
                >{{ wordResponse.data.result.seedict.synonym }}
              </p>
              <p v-if="wordResponse.data.result.seedict.antonym">
                <SeeSymbol class="text-rosybrown-700">反義詞</SeeSymbol
                >{{ wordResponse.data.result.seedict.antonym }}
              </p>
            </div>
          </view>
        </div>
      </view>
    </view>
    <Footer />
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { onMounted, ref,} from 'vue'
import Footer from '@/components/Footer/index.vue';
import SearchBar from '@/components/SearchBar/index.vue';
import type { AudioResponse, WordResponse, WordSeeDict } from '@/utils/typing';
import { correctText } from '@/utils/typography';
import './index.styl'

const wordResponse = ref<WordResponse>({
  status: 0,
  data: {
    w: '',
    result: {
      seedict: {
        text: '',
        glyphs: [],
        pronPrimary: '',
        prons: [],
        phonetics: { yngping: '' },
        expls: [],
      } as WordSeeDict,
      fengs: [],
      ciklings: [],
    },
  },
});


onMounted(() => {

});


const goSearch = (value) => {
  Taro.navigateTo({
    url: `/pages/search/index?q=${value}`,
  })
}
</script>
