<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden pt-1 word-page">
    <search-bar class="relative w-[90vw] sm:w-sm md:w-md" :on-search="goSearch" />
    <view class="mx-auto w-[90vw] sm:w-md md:w-2xl lg:w-3xl mt-10 mb-10">
      <WordHead
        :text="wordResponse.data.result.seedict.text"
        :yngping="wordResponse.data.result.seedict.pronPrimary"
        :voiceUrl="
          audioResponse.data.results[0]
            ? `${ossUrl}/audio/${audioResponse.data.results[0].speaker}/${audioResponse.data.results[0].md5}.mp3`
            : ''
        "
      />
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
            <text class="text-rosybrown-700 see-symbol">注釋</text>
            {{ correctText(wordResponse.data.result.seedict.commentExpl) }}
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
                <text class="text-rosybrown-700" see-symbol>近義詞</text>
                {{ wordResponse.data.result.seedict.synonym }}
              </p>
              <p v-if="wordResponse.data.result.seedict.antonym">
                <text class="text-rosybrown-700 see-symbol">反義詞</text>
                {{ wordResponse.data.result.seedict.antonym }}
              </p>
            </div>
          </view>
        </div>
      </view>
      <view
        v-if="
          wordResponse.data.result.fengs.length > 0 ||
          wordResponse.data.result.ciklings.length > 0
        "
      >
        <view class="border-rosybrown-800 text-rosybrown-800 w-fit border-t-[6px] p-1 text-xl font-bold">
          辞书释义
        </view>
        <WordFengBlock
          v-if="wordResponse.data.result.fengs.length > 0"
          v-for="(feng, index) in wordResponse.data.result.fengs"
          :data="feng"
          :key="index"
        />

        <WordCikLingCard
          :data="wordResponse.data.result.ciklings"
          :isCommentedCikLing="isCommentedCikLing"
        ></WordCikLingCard>
      </view>
      <view
        v-if="
          wordResponse.data.result.seedict.prons.length > 0 ||
          wordResponse.data.result.seedict.commentPron
        "
      >
        <view class="border-rosybrown-800 text-rosybrown-800 w-fit border-t-[6px] p-1 text-xl font-bold">
          各地方音
        </view>
        <view class="mb-5 mt-2 overflow-hidden rounded-lg bg-white text-rosybrown-800">
          <view
            v-if="wordResponse.data.result.seedict.prons.length > 0"
            class="w-full border-collapse table"
          >
            <view class="table-header-group  bg-rosybrown-300 text-center">
              <view class="table-row">
                <view class="py-1 text-white table-cell">读音</view>
                <view class="py-1 text-white table-cell">连读</view>
                <view class="py-1 text-white table-cell">地区</view>
                <!-- <th class="hidden py-1 text-white md:block">来源</th> -->
              </view>
            </view>
            <view class="table-row-group">
              <view class="table-row" v-for="(pron, index) in wordResponse.data.result.seedict.prons" :key="index">
                <view class="py-1.5 table-cell">{{ yngpingToIPA(pron.pron) }}</view>
                <view class="table-cell py-2 md:hidden text-center">
                  <Badge v-if="pron.isSandhi">连</Badge>
                  <Badge v-else>本</Badge>
                </view>
                <view class="hidden items-center justify-center py-2 md:flex">
                  <Badge v-if="pron.isSandhi">连读音</Badge>
                  <Badge v-else>本字音</Badge>
                </view>
                <view class="py-1.5 table-cell">
                  {{ pron.location == '' ? '市区' : pron.location }}
                </view>
                <!-- <td class="hidden py-1.5 md:block">
                  {{ sourceQuoteMap[pron.source] }}
                </td> -->
              </view>
            </view>
          </view>
          <view
            v-if="
              wordResponse.data.result.seedict.prons.length > 0 &&
              wordResponse.data.result.seedict.commentPron
            "
            class="border-t-2 border-rosybrown-100"
          />
          <view
            class="px-8"
            :class="{
              'pb-4 pt-2': wordResponse.data.result.seedict.prons.length > 0,
              'py-6': wordResponse.data.result.seedict.prons.length <= 0,
            }"
            v-if="wordResponse.data.result.seedict.commentPron"
          >
            <view>
              <text class="text-rosybrown-700 see-symbol">注釋 </text>{
              { correctText(wordResponse.data.result.seedict.commentPron) }}
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="
          wordResponse.data.result.seedict.phonetics &&
          wordResponse.data.result.seedict.phonetics.yngping
        "
      >
        <view class="border-rosybrown-800 text-rosybrown-800 w-fit border-t-[6px] p-1 text-xl font-bold">
          注音一览
        </view>
        <WordPhoneticCard
          :data="wordResponse.data.result.seedict.phonetics"
        ></WordPhoneticCard>
      </view>
    </view>
    <Footer />
  </view>
</template>

<script setup lang="ts">
import Taro, { useLoad } from "@tarojs/taro";
import { ref, computed } from 'vue'
import Footer from '@/components/Footer/index.vue';
import SearchBar from '@/components/SearchBar/index.vue';
import WordHead from '@/components/WordHead/index.vue'
import Explanations from '@/components/Explanations/index.vue'
import WordFengBlock from '@/components/WordFengBlock/index.vue'
import WordCikLingCard from '@/components/WordCikLingCard/index.vue'
import Badge from '@/components/Badge/index.vue'
import WordPhoneticCard from '@/components/WordPhoneticCard/index.vue'
import type { AudioResponse, WordResponse, WordSeeDict } from '@/utils/typing';
import { correctText } from '@/utils/typography';
import { yngpingToIPA } from '@/utils/phonetics';
import { searchAudio, searchWord } from "@/api/api";
import './index.styl'

const ossUrl = 'https://oss.seedict.com'

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
const audioResponse = ref<AudioResponse>({
  status: 0,
  data: {
    yngping: '',
    results: [],
  },
});

useLoad((option) => {
  if(option.w) onSearch(option.w);
})

const isCommentedCikLing = computed(() => {
  return wordResponse.value.data.result.ciklings.some(
    (entry) => entry.comment?.trim() !== ''
  );
});

const onSearch = async (value: string) => {
  try {
    const params = new URLSearchParams();
    params.append('w', value);
    Taro.showLoading()
    const { status, data } = await searchWord(params);
    if(status === 200) {
      wordResponse.value = { status, data }
      const yngping = data.result.seedict.pronPrimary;
      if (yngping) {
        const audioParams = new URLSearchParams();
        audioParams.append('yngping', yngping);
        const res = await searchAudio(audioParams)
        audioResponse.value = res;
        sortAudioBySpeaker();
      }
    }
  }catch (e) {
    console.log(e);
  }finally {
    Taro.hideLoading()
  }

}
const sortAudioBySpeaker = () => {
  if (audioResponse.value.data?.results) {
    const speakerPriority: {
      hy: number;
      lk: number;
      [key: string]: number;
    } = {
      hy: 1,
      lk: 2,
    };

    audioResponse.value.data.results.sort((a, b) => {
      const priorityA = speakerPriority[a.speaker] || 3;
      const priorityB = speakerPriority[b.speaker] || 3;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return a.speaker.localeCompare(b.speaker);
    });
  }
};

const goSearch = (value) => {
  Taro.navigateTo({
    url: `/pages/search/index?q=${value}`,
  })
}
</script>
