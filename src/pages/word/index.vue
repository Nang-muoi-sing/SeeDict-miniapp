<template>
  <view class="bg-wheat-50 relative min-h-screen z-10 overflow-hidden pt-1 pb-56 word-page">
    <search-bar class="relative w-[90vw] sm:w-sm md:w-md" :on-search="goSearch" />
    <view class="mx-auto w-[90vw] sm:w-md md:w-2xl lg:w-3xl mt-10">
      <WordHead
        :text="wordResponse.data.result.seedict.text"
        :yngping="wordResponse.data.result.seedict.pronPrimary"
        :voiceUrl="
          audioResponse.data.results[0]
            ? `${ossUrl}/audio/${audioResponse.data.results[0].speaker}/${audioResponse.data.results[0].md5}.mp3`
            : ''
        "
      />
      <view class="mb-5 flex justify-end">
        <view
          class="w-[52rpx] h-[52rpx] rounded-[12rpx] border-[2rpx] border-[#b9ac9f] bg-[#f5f2ed] flex items-center justify-center"
          @tap.stop="openQrcodePopup"
        >
          <Scan2 color="#7f6e60" size="18" />
        </view>
      </view>
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
        <view class="mb-5 mt-2 rounded-lg bg-white px-8 py-6 text-rosybrown-800">
          <Explanations :data="wordResponse.data.result.seedict.expls" />
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
            <view class="my-2 border-t-2 border-rosybrown-100" />
            <view class="space-y-1">
              <view v-if="wordResponse.data.result.seedict.synonym">
                <text class="text-rosybrown-700 see-symbol">近義詞</text>
                {{ wordResponse.data.result.seedict.synonym }}
              </view>
              <view v-if="wordResponse.data.result.seedict.antonym">
                <text class="text-rosybrown-700 see-symbol">反義詞</text>
                {{ wordResponse.data.result.seedict.antonym }}
              </view>
            </view>
          </view>
        </view>
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
                <view class="py-1 text-white table-cell text-center">连读</view>
                <view class="py-1 text-white table-cell text-center">地区</view>
                <!-- <th class="hidden py-1 text-white md:block">来源</th> -->
              </view>
            </view>
            <view class="table-row-group">
              <view class="table-row" v-for="(pron, index) in wordResponse.data.result.seedict.prons" :key="index">
                <view class="py-1.5 table-cell text-center">{{ yngpingToIPA(pron.pron) }}</view>
                <view class="table-cell py-2 md:hidden text-center">
                  <Badge v-if="pron.isSandhi">连</Badge>
                  <Badge v-else>本</Badge>
                </view>
                <view class="hidden items-center justify-center py-2 md:flex">
                  <Badge v-if="pron.isSandhi">连读音</Badge>
                  <Badge v-else>本字音</Badge>
                </view>
                <view class="py-1.5 table-cell text-center">
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
              <text class="text-rosybrown-700 see-symbol">注釋</text>
              {{ correctText(wordResponse.data.result.seedict.commentPron) }}
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

      <view
        v-if="
          wordResponse.data.result.seedict.glyphs.length > 0 ||
          wordResponse.data.result.seedict.commentGlyph
        "
      >
        <view class="border-rosybrown-800 text-rosybrown-800 w-fit border-t-[6px] p-1 text-xl font-bold">
          用字一览
        </view>
        <view
          class="mb-5 mt-2 overflow-hidden rounded-lg bg-white text-rosybrown-800"
        >
          <view
            v-if="wordResponse.data.result.seedict.glyphs.length > 0"
            class="w-full border-collapse table"
          >
            <view class="table-header-group bg-rosybrown-300 text-center">
              <view class="table-row">
                <view class="py-1 text-white table-cell">用字</view>
                <view class="py-1 text-white table-cell text-center">类别</view>
                <!-- <th class="py-1 text-white">来源</th> -->
              </view>
            </view>
            <view class="text-center table-row-group">
              <view
                v-for="(glyph, index) in wordResponse.data.result.seedict
                    .glyphs"
                :key="index"
                class="table-row"
              >
                <view class="py-1.5 table-cell">{{ glyph.glyph }}</view>
                <view class="items-center justify-center py-2 table-cell">
                  <Badge v-if="glyph.category">{{ glyph.category }}</Badge>
                  <Badge v-else>N/A</Badge>
                </view>
                <!-- <td class="py-1.5">{{ glyph.source }}</td> -->
              </view>
            </view>
          </view>
<!--          <view
            v-if="wordResponse.data.result.seedict.prons.length > 0"
            class="w-full border-collapse table"
          >
            <view class="table-header-group  bg-rosybrown-300 text-center">
              <view class="table-row">
                <view class="py-1 text-white table-cell">用字</view>
                <view class="py-1 text-white table-cell text-center">类别</view>
                &lt;!&ndash; <th class="hidden py-1 text-white md:block">来源</th> &ndash;&gt;
              </view>
            </view>
            <view class="table-row-group">
              <view class="table-row" v-for="(glyph, index) in wordResponse.data.result.seedict.glyphs" :key="index">
                <view class="py-1.5 table-cell text-center">{{ glyph.glyph }}</view>
                <view class="flex items-center justify-center py-2">
                  <Badge v-if="glyph.category">{{ glyph.category }}</Badge>
                  <Badge v-else>N/A</Badge>
                </view>
                &lt;!&ndash; <td class="py-1.5">{{ glyph.source }}</td> &ndash;&gt;
              </view>
            </view>
          </view>-->
          <view
            v-if="
              wordResponse.data.result.seedict.glyphs.length > 0 &&
              wordResponse.data.result.seedict.commentGlyph
            "
            class="border-t-2 border-rosybrown-100"
          />

          <view
            class="px-8"
            :class="{
              'pb-4 pt-2': wordResponse.data.result.seedict.glyphs.length > 0,
              'py-6': wordResponse.data.result.seedict.glyphs.length <= 0,
            }"
            v-if="wordResponse.data.result.seedict.commentGlyph"
          >
            <view>
              <text class="text-rosybrown-700 see-symbol">注釋</text>
              {{ correctText(wordResponse.data.result.seedict.commentGlyph) }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="isQrcodePopupVisible"
      class="fixed inset-0 z-[1200] bg-[rgba(0,0,0,0.45)] flex items-center justify-center p-[32rpx] box-border"
      @tap="closeQrcodePopup"
    >
      <view class="w-[520rpx] max-w-full bg-white rounded-[16rpx] p-[24rpx] box-border" @tap.stop>
        <image
          class="w-full h-[472rpx] rounded-[12rpx] bg-[#f8f7f5]"
          :src="qrcodeImageSrc"
          mode="aspectFit"
          show-menu-by-longpress
          @longpress.stop.prevent="saveQrcodeImage"
        />
        <view class="mt-[18rpx] text-center text-[26rpx] text-[#8e7c6d]">长按图片保存到本地</view>
      </view>
    </view>
    <Footer />
  </view>
</template>

<script setup lang="ts">
import Taro, { useLoad, useShareAppMessage, useShareTimeline  } from "@tarojs/taro";
import { ref, computed } from 'vue'
import { Scan2 } from '@nutui/icons-vue-taro';
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
import qrcodePlaceholder from '@/assets/logo-see.png';
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
let q: string = ref<string>('');

useLoad((option) => {
  if(option.w) {
    onSearch(option.w);
    q.value = option.w
  }
})
useShareAppMessage((res) => {

  // res.from 可区分分享来源：'button' 或 'menu'
  if (res.from === 'button') {
    console.log('来自页面内分享按钮', res.target)
  }

  return {
    title: `${wordResponse.value.data.result.seedict.text} - 福州话词汇`,
    path: `/pages/word/index?w=${q.value}`
  }
})
useShareTimeline((res) => {
  // res.from 可区分分享来源：'button' 或 'menu'
  if (res.from === 'button') {
    console.log('来自页面内分享按钮', res.target)
  }

  return {
    title: `${wordResponse.value.data.result.seedict.text} - 福州话词汇`,
    query: `w=${q.value}`,
  }
})

const isCommentedCikLing = computed(() => {
  return wordResponse.value.data.result.ciklings.some(
    (entry) => entry.comment?.trim() !== ''
  );
});

const isQrcodePopupVisible = ref(false);
const isSavingQrcode = ref(false);

// TODO: 接入后端二维码接口后，替换为接口返回的图片地址。
const qrcodeImageSrc = computed(() => qrcodePlaceholder);

const openQrcodePopup = () => {
  isQrcodePopupVisible.value = true;
};

const closeQrcodePopup = () => {
  isQrcodePopupVisible.value = false;
};

const ensureAlbumPermission = async () => {
  const { authSetting } = await Taro.getSetting();
  const permission = authSetting?.['scope.writePhotosAlbum'];
  if (permission !== false) {
    return true;
  }

  const modalRes = await Taro.showModal({
    title: '需要相册权限',
    content: '请在设置中允许保存到相册',
    confirmText: '去设置',
  });
  if (!modalRes.confirm) {
    return false;
  }

  const openSettingRes = await Taro.openSetting();
  return !!openSettingRes.authSetting?.['scope.writePhotosAlbum'];
};

const resolveQrcodeFilePath = async (src: string) => {
  if (src.startsWith('data:image/')) {
    const dataUrlMatch = src.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!dataUrlMatch) {
      throw new Error('invalid data url');
    }
    const ext = dataUrlMatch[1] || 'png';
    const base64Data = dataUrlMatch[2];
    const filePath = `${Taro.env.USER_DATA_PATH}/word-qrcode-${Date.now()}.${ext}`;
    const fileSystemManager = Taro.getFileSystemManager();

    await new Promise<void>((resolve, reject) => {
      fileSystemManager.writeFile({
        filePath,
        data: base64Data,
        encoding: 'base64',
        success: () => resolve(),
        fail: (error) => reject(error),
      });
    });
    return filePath;
  }

  if (/^https?:\/\//.test(src)) {
    const downloadRes = await Taro.downloadFile({
      url: src,
    });
    if (downloadRes.statusCode !== 200 || !downloadRes.tempFilePath) {
      throw new Error(`download failed: ${downloadRes.statusCode}`);
    }
    return downloadRes.tempFilePath;
  }

  const imageInfo = await Taro.getImageInfo({
    src,
  });
  return imageInfo.path;
};

const saveQrcodeImage = async () => {
  if (isSavingQrcode.value) {
    return;
  }
  isSavingQrcode.value = true;

  try {
    const hasPermission = await ensureAlbumPermission();
    if (!hasPermission) {
      Taro.showToast({
        title: '未开启相册权限',
        icon: 'none',
      });
      return;
    }

    Taro.showLoading({
      title: '保存中',
    });

    const filePath = await resolveQrcodeFilePath(qrcodeImageSrc.value);

    await Taro.saveImageToPhotosAlbum({
      filePath,
    });

    Taro.showToast({
      title: '已保存到相册',
      icon: 'success',
    });
  } catch (error) {
    const errMsg = String((error as { errMsg?: string })?.errMsg || '');
    if (errMsg.includes('cancel')) {
      Taro.showToast({
        title: '已取消保存',
        icon: 'none',
      });
      return;
    }
    if (errMsg.includes('auth deny') || errMsg.includes('auth denied')) {
      const modalRes = await Taro.showModal({
        title: '需要相册权限',
        content: '请在设置中允许保存到相册',
        confirmText: '去设置',
      });
      if (modalRes.confirm) {
        await Taro.openSetting();
      }
      return;
    }

    Taro.showToast({
      title: '保存失败，请重试',
      icon: 'none',
    });
  } finally {
    isSavingQrcode.value = false;
    Taro.hideLoading();
  }
};

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
