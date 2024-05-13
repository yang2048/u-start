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
    <page-head title="scroll-view,区域滚动视图"></page-head>

    <view>
      <scroll-view
        :scroll-y="true"
        class="h-vh"
        @scrolltolower="lower"
      >
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
        <view id="demo3" class="scroll-view-item bg-blue">C</view>
        <view id="demo1" class="scroll-view-item bg-#fa0">A</view>
        <view id="demo2" class="scroll-view-item bg-green">B</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import _ from "lodash";
import { getVodList } from "@/services";
import { useRequest } from "alova";
import { usePlayStore } from "@/store";
import { fetchClassify, fetchList } from "@/utils/cms";

const upper = (e) => {
  console.log(e);
};
const lower = (e) => {
  console.log(e);
};
</script>

<style>
.scroll-Y {
  height: 100vh;
}

.scroll-view-item {
  height: 300rpx;
  line-height: 300rpx;
  text-align: center;
  font-size: 36rpx;
}

</style>
