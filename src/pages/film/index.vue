<script setup lang="ts">
import { getVodList } from "@/services";
import { useRequest, invalidateCache } from "alova";
import { usePlayStore } from "@/store";

const storePlayer = usePlayStore();

const config = ref({
  classList: [
    {
      name: "关注",
    },
    {
      name: "推荐",
    },
    {
      name: "电影",
    },
    {
      name: "科技",
    },
    {
      name: "音乐",
    },
    {
      name: "美食",
    },
    {
      name: "文化",
    },
    {
      name: "财经",
    },
    {
      name: "手工",
    },
  ],
});
onLoad(() => {});

const { data: vod, loading } = useRequest(() => getVodList(5, 1));
const onScrollToLower = () => {
  console.info("onScrollToLower");
};
const onRefresherrefresh = () => {
  console.info("onRefresherrefresh");
};

//播放
const toPage = (page: string, item?: any) => {
  storePlayer.updateConfig({
    type: "film",
    data: {
      info: item,
      // ext: { site: site },
    },
  });
  uni.$uv.route(page);
};
</script>

<template>
  <view class="container">
    <uv-navbar placeholder leftText="返回">
      <template #center>
        <view class="ml-3">
          <uv-search
            placeholder="搜索"
            disabled
            :showAction="false"
            @click="toPage('pages/search/index')"
            :customStyle="{ width: '80%' }"
          ></uv-search>
        </view>
      </template>
    </uv-navbar>

    <view class="">
      <uv-tabs :list="config.classList"></uv-tabs>
    </view>
    <view class="px-3">
      <scroll-view
        enable-flex
        refresher-enabled
        scroll-y
        :style="{ height: '100%', width: '100%' }"
        :lower-threshold="300"
        @scrolltolower="onScrollToLower"
        @refresherrefresh="onRefresherrefresh"
      >
        <view class="grid grid-cols-3 gap-2 justify-center flex-items-center">
          <view v-for="(item, index) in vod.list" :key="index">
            <div class="" @click="toPage('pages/play/index', item)">
              <uv-image
                :src="item.vod_pic"
                :showMenuByLongpress="false"
                width="100%"
                :height="150"
                mode="scaleToFill"
                :radius="5"
                :observeLazyLoad="true"
                :fade="true"
                duration="450"
              ></uv-image>
              <div class="scroll-wrap">
                <div class="scroll-item text-3">
                  {{ item.vod_name }}
                </div>
              </div>
            </div>
          </view>
        </view>
      </scroll-view>
      <view v-if="vod.list > 0 || loading" class="my-5">
        <uv-load-more :status="loading" />
      </view>
      <view v-if="vod.total == 0 && !loading">
        <uv-empty mode="list"></uv-empty>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
