<script setup lang="ts">
let videoContext: UniApp.VideoContext;

const rateShow = ref(false);
const fullScreen = ref(false);
const screenFit = ref("contain");

const getList = ref([
  {
    name: "♥央视频道",
    childrens: [
      {
        name: "CCTV1-4K",
        desc:
          "一群热爱",
      },
    ],
  },
  {
    name: "❤️地方卫视💕",
    childrens: [
      {
        name: "广西卫视",
        desc:
          "小程序平台",
      },
      {
        name: "集成工具",
        desc:
          "网络请求",
      },
      {
        name: "主题扩展",
        desc:
          "网络请求",
      },
    ],
  },
]);

const chain = ref(true);

onLoad(() => {
  videoContext = uni.createVideoContext("video-live");
});

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
  console.log("onControlsToggle=>", e.detail.show);
  rateShow.value = e.detail.show;
};

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
        src="https://0472.org/hls/cgtn.m3u8"
        :object-fit="screenFit"
        :initial-time="0"
        :playStrategy="2"
        @fullscreenchange="onFullScreen"
        @controlstoggle="onControlsToggle"
      >
        <cover-view class="absolute top-0 left-1/4 w-1/2" v-show="rateShow && fullScreen">
          <cover-view class="text-4 c-#fff bg-#0009">
            <view class="flex m-2">
              <span>旋转屏幕:</span>
              <view
                v-for="(item, index) in [-90, 0, 90]"
                :key="index"
                :data-rate="item"
                @tap="switchDirection(item)"
                :class="['ml-5']"
              >
                {{ item }}°
              </view>
            </view>
            <view class="flex m-2">
              <span>画面尺寸:</span>
              <view
                v-for="(item, index) in ['contain', 'fill', 'cover']"
                :key="index"
                :data-rate="item"
                @tap="switchFit(item)"
                :class="['ml-5']"
              >
                {{ item == "contain" ? "包含" : item == "fill" ? "填充" : "覆盖" }}
              </view>
            </view>
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
        :list="getList"
        :height="height"
        hdHeight="100rpx"
        @change="change"
      >
        <template v-for="(item, index) in getList" :key="index">
          <uv-vtabs-item :index="index">
            <uv-list v-for="(item2, index2) in item.childrens" :key="index2">
                <uv-list-item :title="item2.name " :note="item2.desc" clickable :border="true"></uv-list-item>
            </uv-list>
            <view class="gap" v-if="index < getList.length - 1">
              <view bg-color="#f1f1f1" class="h-3 bg-#f1f1f1"></view>
            </view>
          </uv-vtabs-item>
        </template>
        <uv-gap bg-color="#fff" height="600"></uv-gap>
      </uv-vtabs>
    </view>
  </view>
</template>
