<script setup lang="ts">
import _ from "lodash";
import { usePlayStore } from "@/store";
import { parseChannel } from "@/utils/cms";

const storePlayer = usePlayStore();
let videoContext: UniApp.VideoContext;

const siteIptv = computed(() => {
  return storePlayer.getIptv;
});

const video_url = ref("https://0472.org/hls/cgtn.m3u8");
const rateShow = ref(false);
const fullScreen = ref(false);
const screenFit = ref("contain");
const channel = ref();

const chain = ref(true);

onLoad(() => {
  videoContext = uni.createVideoContext("video-live");

  loadIptv();
});

const loadIptv = async () => {
  const tv: any = _.find(siteIptv.value, { id: "2" });
  const iptv = await parseChannel(tv.type, tv.url);

  channel.value = _(iptv)
    .groupBy("group")
    .map((children, parentId) => ({
      name: parentId || 0,
      children: _.map(children, (node) => ({
        id: node.id,
        name: node.name,
        logo: node.logo,
        url: node.url,
        children: [],
      })),
    }))
    .value();
  console.info("iptv", channel.value);
};

const height = computed(() => {
  return uni.getSystemInfoSync().windowHeight - uni.upx2px(100);
});

const change = (index: any) => {
  console.log("选项改变：", index);
};

const onFullScreen = (e: any) => {
  fullScreen.value = e.detail.fullScreen;
};

const onControlsToggle = (e: any) => {
  rateShow.value = e.detail.show;
};

const play = (item: any) => {
  video_url.value = item.url;
};

const switchDirection = (e: any) => {
  videoContext.requestFullScreen({ direction: e });
  uni.showToast({
    title: `旋转 ${e}`,
    icon: "success",
  });
};

const switchFit = (e: any) => {
  screenFit.value = e;
  uni.showToast({
    title: `画面尺寸 ${e}`,
    icon: "success",
  });
};
</script>

<template>
  <view class="container">
    <!-- 播放器 -->
    <view class="video-name">
      <video
        class="video-play"
        style="width: 100%"
        id="video-live"
        enable-danmu
        enablePlayGesture
        show-snapshot-button
        show-casting-button
        picture-in-picture-show-progress
        show-screen-lock-button
        show-background-playback-button
        :src="video_url"
        :object-fit="screenFit"
        :initial-time="0"
        :playStrategy="2"
        @fullscreenchange="onFullScreen"
        @controlstoggle="onControlsToggle"
      >
        <cover-view class="absolute top-0 left-1/4 w-1/2" v-show="rateShow && fullScreen">
          <cover-view class="text-4 c-#fff bg-#0009">
            <cover-view class="flex m-2">
              <cover-view>旋转屏幕:</cover-view>
              <view
                v-for="(item, index) in [-90, 0, 90]"
                :key="index"
                :data-rate="item"
                @tap="switchDirection(item)"
                :class="['ml-5']"
              >
                {{ item }}°
              </view>
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
    <view>
      <view
        style="
          height: 80rpx;
          background: #ecf5ff;
          color: #909193;
          display: flex;
          justify-content: center;
          text-align: center;
        "
      >
        <text>欢迎使用</text>
      </view>
      <uv-vtabs
        :chain="chain"
        :list="channel"
        :height="height"
        :hdHeight="250"
        @change="change"
      >
        <template v-for="(item, index) in channel" :key="index">
          <uv-vtabs-item :index="index">
            <uv-list v-for="(item2, index2) in item.children" :key="index2">
              <uv-list-item
                :title="item2.name"
                :note="item2.desc"
                clickable
                :border="true"
                @click="play(item2)"
              ></uv-list-item>
            </uv-list>
            <view class="gap" v-if="index < channel.length - 1">
              <view bg-color="#f1f1f1" class="h-3 bg-#f1f1f1"></view>
            </view>
          </uv-vtabs-item>
        </template>
        <uv-gap bg-color="#fff" height="600"></uv-gap>
      </uv-vtabs>
    </view>
  </view>
</template>
