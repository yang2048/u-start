<script setup lang="ts">
import { getVodList } from "@/services";
import { useRequest, invalidateCache } from "alova";

let options = ref();
onLoad(() => {});

const { data: vod, loading } = useRequest(() => getVodList(0, 1));
const vodList = ref(vod.list);
const vodTotal = ref(vod.total);

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
    <view>
      <PullList>
        <template #list>
          <view class="grid grid-cols-3 gap-2 justify-center flex-items-center">
            <view
              class="rounded-md m-3"
              v-for="(item, index) in vod.list"
              :key="index"
            >
              <div class="">
                <uv-image
                  :src="item.vod_pic"
                  :showMenuByLongpress="false"
                  mode="aspectFill"
                  radius="5px"
                  :observeLazyLoad="true"
                  :fade="true"
                  duration="450"
                  class="h-310 w-full"
                ></uv-image>
                <div class="scroll-wrap">
                  <div class="scroll-item">
                    {{ item.vod_name }}
                  </div>
                </div>
              </div>
            </view>
          </view>
        </template>
      </PullList>
      <view v-if="vod.list > 0 || loading" class="my-5">
        <!-- <uv-load-more :status="pager.status" @loadmore="loadData" /> -->
      </view>
      <view v-if="vod.total == 0 && loading">
        <uv-empty mode="list"></uv-empty>
      </view>
    </view>
  </view>
</template>

<style scoped></style>
