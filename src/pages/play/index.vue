<script setup lang="ts">
import {
  formatName,
  formatSeason,
  reverseOrderHelper,
  formatReverseOrder,
} from "@/utils/film";
import { usePlayStore } from "@/store";
import _ from "lodash";

let videoContext: UniApp.VideoContext;

const type = computed(() => {
  return store.getType;
});
const store = usePlayStore();
const data = computed(() => {
  return store.getData;
});
const setting = computed(() => {
  return store.getSetting;
});
const info = ref(data.value.info) as any;
const ext = ref(data.value.ext) as any;
console.info(info.value);

const video_urls = ref(info.value.vod_play_url.split("#"));
const video_url = ref(video_urls.value[0].split("$")[1]);
const screenFit = ref("contain");
const rateShow = ref(false);

const active = reactive({
  iptvNav: "epg",
  driveNav: "season",
  flimSource: "",
  filmIndex: "",
  filmCurrent: "",
  profile: false,
  seasonKey: "",
});
const season = ref(); // 选集
const fullScreen = ref(false);

onLoad(() => {
  videoContext = uni.createVideoContext("video-1");
  const { site } = ext.value;
  getDetailInfo();
});

// 获取播放源及剧集
const getDetailInfo = async (): Promise<void> => {
  const formattedSeason = await formatSeason(info.value);

  active.flimSource = active.flimSource || Object.keys(formattedSeason)[0];
  active.filmIndex = active.filmIndex || formattedSeason[active.flimSource][0];

  info.value.fullList = formattedSeason;
  season.value = formattedSeason;
  active.seasonKey = Object.keys(season.value)[0];
  console.info("选集", season.value);
};

// 选集排序
const reverseOrderEvent = (reverse: boolean) => {
  // isVisible.reverseOrder = !isVisible.reverseOrder;
  if (reverse) {
    season.value = reverseOrderHelper("positive", info.value.fullList);
  } else {
    season.value = reverseOrderHelper("negative", season.value);
  }
};

// 切换源
function switchVideo(item: any) {
  console.info(item);
  active.seasonKey = item.name;
}

// 切换选集
const changeEvent = async (item: any) => {
  active.filmIndex = item;
  video_url.value = item.split("$")[1];
  console.info("切换选集", item);
  uni.showToast({
    title: `切换选集 ${item.split("$")[0]}`,
    icon: "loading",
    mask: true,
    duration: 1000,
  });
};

function onReverse() {
  video_urls.value.reverse();
}

const onFullScreen = (e: any) => {
  fullScreen.value = e.detail.fullScreen;
};

const onControlsToggle = (e: any) => {
  console.log("onControlsToggle=>", e.detail.show);
  rateShow.value = e.detail.show;
};

function onEnded() {
  console.log("onEnded =>自动下一集");
  uni.showToast({
    title: `自动下一集`,
    icon: "success",
  });
}

function switchRate(e: any) {
  console.log("switchRate => ", e);
  videoContext.playbackRate(e);
  uni.showToast({
    title: `倍速 ${e}`,
    icon: "success",
  });
}

const switchDirection = (e: any) => {
  console.log("switchDirection => ", e);
  videoContext.requestFullScreen({ direction: e });
  uni.showToast({
    title: `旋转 ${e}`,
    icon: "success",
  });
};

const switchFit = (e: any) => {
  console.log("switchFit => ", e);
  screenFit.value = e;
  uni.showToast({
    title: `画面尺寸 ${e}`,
    icon: "success",
  });
};
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

    <!-- 播放器 -->
    <view class="video-name">
      <video
        class="video-play"
        style="width: 100%"
        id="video-1"
        enable-danmu
        enablePlayGesture
        show-snapshot-button
        show-casting-button
        picture-in-picture-show-progress
        show-screen-lock-button
        show-background-playback-button
        :object-fit="screenFit"
        :src="video_url"
        :initial-time="0"
        :playStrategy="2"
        @ended="onEnded"
        @fullscreenchange="onFullScreen"
        @controlstoggle="onControlsToggle"
      >
        <cover-view class="absolute top-0 left-1/4 w-1/2" v-show="rateShow && fullScreen">
          <cover-view class="text-4 c-#fff bg-#0009">
            <cover-view class="flex m-2">
              <cover-view>倍速播放:</cover-view>
              <cover-view
                v-for="(item, index) in [0.5, 0.8, 1.0, 1.25, 1.5, 2.0]"
                :key="index"
                :data-rate="item"
                @tap="switchRate(item)"
                :class="['ml-5']"
              >
                x{{ item }}
              </cover-view>
            </cover-view>
            <cover-view class="flex m-2">
              <cover-view>旋转屏幕:</cover-view>
              <cover-view
                v-for="(item, index) in [-90, 0, 90]"
                :key="index"
                :data-rate="item"
                @tap="switchDirection(item)"
                :class="['ml-5']"
              >
                {{ item }}°
              </cover-view>
            </cover-view>
            <cover-view class="flex m-2">
              <cover-view>画面尺寸:</cover-view>
              <cover-view
                v-for="(item, index) in ['contain', 'fill', 'cover']"
                :key="index"
                :data-rate="item"
                @tap="switchFit(item)"
                :class="['ml-5']"
              >
                {{ item == "contain" ? "包含" : item == "fill" ? "填充" : "覆盖" }}
              </cover-view>
            </cover-view>
          </cover-view>
        </cover-view>
      </video>
    </view>

    <!-- 详细介绍 -->
    <view>
      <view class="vod-name w-full">
        <div class="scroll-wrap">
          <div class="scroll-item text-base font-bold p-2 font-sans">
            {{ info["vod_name"] }}
            <span class="text-xs font-medium">{{
              `${formatIndex(active.filmIndex).index}`
            }}</span>
          </div>
        </div>
      </view>
      <view class="flex bg-white">
        <view class="w-1/3 p-1">
          <image
            :src="info.vod_pic"
            show-menu-by-longpress
            alt="Cover"
            class="rounded-3 w-28 h-36"
          />
        </view>
        <view class="w-2/3 p-1 text-sm">
          <p class="text-gray-600">
            <span class="text-gray-500">动态：</span>{{ info.vod_remarks }}
          </p>
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
              size="13"
            ></uv-text>
          </p>
        </view>
      </view>
    </view>

    <!-- 剧集 -->
    <view class="mt-3 py-5 bg-#fff">
      <uv-tabs
        :list="Object.keys(season).map((key) => ({ name: key, value: season[key] }))"
        :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        @change="switchVideo"
        v-if="season"
      >
        <template v-slot:right>
          <view class="px-2">
            <uv-icon name="arrow-up" size="22" bold></uv-icon>
          </view>
        </template>
      </uv-tabs>
      <view>
        <view class="flex flex-wrap">
          <view
            class="h-6 mx-1 my-2"
            v-for="(item, index) in season[active.seasonKey]"
            :key="index"
          >
            <view class="p-2 inline-block rounded-3 bg-amber" @click="changeEvent(item)">
              {{ formatName(item) }}
            </view>
          </view>
        </view>
      </view>
      <view v-if="!season">
        <uv-empty
          mode="data"
          icon="http://cdn.uviewui.com/uview/empty/data.png"
        ></uv-empty>
      </view>
    </view>
  </view>

  <!-- 热门推荐 -->
  <view class="my-3 pb-10 rounded-3 bg-#fff">
    <uni-section title="热门推荐" type="line"></uni-section>
    <uv-empty mode="data" icon="https://cdn.uviewui.com/uview/empty/data.png"></uv-empty>
  </view>
</template>

<style lang="scss"></style>
