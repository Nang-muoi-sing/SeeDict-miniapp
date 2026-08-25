<template>
  <view class="download-image-container">
    <view
      class="w-[52rpx] h-[52rpx] rounded-[12rpx] border-[2rpx] border-[#b9ac9f] bg-[#f5f2ed] flex items-center justify-center"
      @tap.stop="openQrcodePopup"
    >
      <Scan2 color="#7f6e60" size="18" />
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
  </view>
</template>

<script setup lang="ts">
import Taro, {  } from "@tarojs/taro";
import { ref, computed } from 'vue'
import { Scan2 } from '@nutui/icons-vue-taro';
import qrcodePlaceholder from '@/assets/logo-see.png';
import './index.styl'

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

</script>
