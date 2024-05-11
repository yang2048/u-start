<script setup lang="ts">
import { usePlayStore } from "@/store";

const store = usePlayStore();
const data = computed(() => {
  return store.getData;
});
const set = computed(() => {
  return store.getSetting;
});
const info = ref(data.value.info) as any;
const ext = ref(data.value.ext) as any;
console.info(info.value);

const video_urls = ref(info.value.vod_play_url.split("#"));
const video_url = ref(video_urls.value[0].split("$")[1]);
const direction = ref(90);
const rateShow = ref(false);

function switchVideo(item: any) {
  // console.info(item);
  //   Taro.showToast({
  //     title: item.split("$")[0],
  //     icon: "loading",
  //     mask: true,
  //     duration: 800,
  //   });
  video_url.value = item.split("$")[1];
}

function onReverse() {
  video_urls.value.reverse();
}

function onControlsToggle(e: any) {
  // console.log("onControlsToggle=>", detail.show);
  rateShow.value = e.detail.show;
}

function onEnded() {
  console.log("onEnded=>自动下一集");
}

function switchRate(e: any) {
  console.log("switchRate=> ", e);
  //   let videoContext = Taro.createVideoContext("video-1");
  //   videoContext.playbackRate(e);
  //   Taro.showToast({
  //     title: `倍速 x${e}`,
  //     icon: "success",
  //   });
}

function onLoadedMetaData(e: any) {
  const videoRatio = e.detail.width / e.detail.height;
  // 判断长宽比确定全屏方向
  if (videoRatio < 1) {
    direction.value = 0;
  }
  // console.log("onLoadedMetaData=>", videoRatio, direction.value);
}
</script>

<template>
  <view class="container">
    <u-no-network></u-no-network>
    <!-- <u-navbar
      back-text=""
      :title="info.vod_name"
      :border-bottom="false"
      back-icon-color="#eee"
      immersive
    ></u-navbar> -->

    <view class="video-name">
      <video
        class="video-play"
        style="width: 100%"
        id="video-1"
        enable-danmu
        enablePlayGesture
        enableAutoRotation
        :src="video_url"
        :initial-time="0"
        :showCastingButton="true"
        :showRateBtn="true"
        :showScreenLockButton="true"
        :showSnapshotButton="true"
        :showBackgroundPlaybackButton="true"
        :showThinProgressBar="true"
        :showVslideBtnInFullscreen="true"
        :mobilenetHintType="1"
        floatingMode="page"
        :showNoWifiTip="true"
        :pictureInPictureMode="['push', 'pop']"
        object-fit="contain"
        @ended="onEnded"
        @loadedMetaData="onLoadedMetaData"
        @controlsToggle="onControlsToggle"
      >
        <cover-view class="" v-if="rateShow">
          <cover-view class="video-control">
            <view class="flex font-size-13 m-2">
              <span>倍速播放:</span>
              <view
                v-for="(item, index) in [0.5, 0.8, 1.0, 1.25, 1.5, 2.0]"
                :key="index"
                :data-rate="item"
                @tap="switchRate(item)"
                :class="['ml-2']"
              >
                x{{ item }}
              </view>
            </view>
            <view class="flex font-size-13 m-2">
              <span>旋转屏幕:</span>
              <view
                v-for="(item, index) in [-90, 0, 90]"
                :key="index"
                :data-rate="item"
                @tap="switchRate(item)"
                :class="['ml-2']"
              >
                {{ item }}°
              </view>
            </view>
          </cover-view>
        </cover-view>
      </video>
    </view>

    <!-- 详细介绍 -->
    <view>
      <div class="vod-name w-full">
        <div class="scroll-wrap">
          <div class="scroll-item text-base font-bold p-2 font-sans">
            {{ info.vod_name }}
            <span class="text-xs font-medium">{{ info.vod_remarks }}</span>
          </div>
        </div>
      </div>
      <div class="flex bg-white">
        <div class="w-1/3 p-1">
          <image :src="info.vod_pic" alt="Cover" class="rounded-3 w-28 h-36" />
        </div>
        <div class="w-2/3 p-1 text-sm">
          <p class="text-gray-600">
            <span class="text-gray-500">类型：</span>{{ info.type_name }} ·
            {{ info.vod_tag }}
          </p>
          <p class="text-gray-600">
            <span class="text-gray-500">地区：</span>{{ info.vod_area }}
            <span class="text-gray-500">语言：</span>{{ info.vod_lang }}
          </p>
          <p class="text-gray-600">
            <span class="text-gray-500">年份：</span>{{ info.vod_year }}
            <span class="text-gray-500">导演：</span>{{ info.vod_director }}
          </p>
          <p class="text-gray-600">
            <span class="text-gray-500">状态：</span>{{ info.vod_state }}
            <span class="text-gray-500">评分：</span>{{ info.vod_douban_score }}
          </p>
          <p class="text-gray-600">
            <uv-text
              :text="info.vod_blurb ? info.vod_blurb.trim() : '暂无剧情简介'"
              lines="4"
              size="15"
            ></uv-text>
          </p>
        </div>
      </div>
    </view>

    <!-- 剧集 -->
    <view class="mt-3">
      <view class="p-3">
        <button plain type="warn" size="mini">{{info.vod_play_from}}</button>
        <span class="float-right">
          <span class="mr-2 text-center" @click="onReverse()">
            <div
              class="text-size-xl text-gray-600 i-icon-park-outline-reverse-operation-in"
            />
          </span>
        </span>
      </view>
      <scroll-view enable-flex scroll-y style="height: 400rpx">
        <div class="flex flex-wrap justify-start gap-2 flex-items-center p-2" v-for="(item, index) in video_urls" :key="index">
          <uv-button plain :text="item.split('$')[0]" size="small" shape="circle" ></uv-button>
        </div>
      
        <!-- <uv-row justify="space-between" gutter="10">
          <uv-col span="6"
            v-for="(item, index) in video_urls"
            :key="index"
            class="pl-2 pt-2"
          >
            <nv-button size="small" @click="switchVideo(item)">
              <div class="scroll-wrap">
                <div class="scroll-item whitespace-nowrap">
                  {{ item.split("$")[0] }}
                </div>
              </div>
            </nv-button>
          </uv-col>
        </uv-row> -->
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss"></style>
