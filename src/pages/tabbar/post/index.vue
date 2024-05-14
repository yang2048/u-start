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

    <view>
      <uv-list v-for="(item, index) in tbl_site">
        <uv-list-item
          :title="item.name"
          :note="`资源数：${item.resource? item.resource : 0}`"
          rightText=""
          clickable
          show-arrow
        >
          <template #header>
            <view class="w-5 px-2">
              <div
                :class="[
                  item.status
                    ? 'i-mdi-cloud-alert-outline'
                    : 'i-mdi-cloud-check-outline',
                  item.status
                    ? 'c-green'
                    : 'c-amber',
                    'text-5'
                ]"
              ></div>
              <!-- <div v-if="item.isActive" class="i-mdi-checkbox-marked-circle-outline c-blue"></div> -->
            </view>
          </template>
        </uv-list-item>
      </uv-list>
    </view>
  </view>
</template>

<script setup lang="ts">
import _ from "lodash";
import { usePlayStore } from "@/store";
import { fetchClassify, fetchList } from "@/utils/cms";
import { tbl_site } from "@/constants/config0514.json";

const lower = (e: any) => {
  console.log(e);
};
const switchChange = (e: any) => {
  console.log(e);
};
</script>

<style></style>
