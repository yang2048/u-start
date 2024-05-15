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
        
    <view class="m-3 rounded-3 px-5 bg-#fff">
      <uv-list v-for="(item, index) in _.sortBy(tbl_site, ['isActive'])" :key="index">
        <uv-list-item
          :title="item.name"
          :note="`${item.group} -> 资源数：${item.resource? item.resource : 0}`"
          rightText=""
          clickable
          show-arrow
          border
          @click="openEdit(item)"
        >
          <template #header>
            <view class="w-8">
              <div
                :class="[
                  item.isActive
                    ? 'i-mdi-cloud-check-outline'
                    : 'i-mdi-cloud-alert-outline',
                  item.isActive
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

  <view>
    <uv-popup ref="editModel" mode="center" custom-style="min-height: 200rpx;max-width: 80%">
			<view class="p-5">
				<view>识别码：{{siteDetail.key}}</view>
				<view>名 称：{{siteDetail.name}}</view>
				<view>分 组：{{siteDetail.group}}</view>
        <view>类 型：{{siteDetail.type}}</view>
        <view>状 态：{{siteDetail.status}}</view>
        <view>激 活：{{siteDetail.isActive}}</view>
        <view class="flex justify-evenly ">
          <uv-button type="primary" text="设为默认" @tap="onDefault"></uv-button>
          <uv-button type="warning" text="禁用站点" @click="onDefault"></uv-button>
        </view>
			</view>
		</uv-popup>
  </view>
</template>

<script setup lang="ts">
import _ from "lodash";
import { usePlayStore } from "@/store";
import { tbl_site } from "@/constants/config0514.json";

const storePlayer = usePlayStore();

const editModel = ref()
const siteDetail = ref({})

const openEdit = (item: any) => {
  editModel.value.open();
  siteDetail.value = item
}

const onDefault = () => {
  console.info(siteDetail)
  storePlayer.updateConfig({
    site: {
      default: siteDetail.value,
    },
  });
  editModel.value.close();
  uni.showToast({
    title: `切换源 ${siteDetail.value.name}`,
    icon: "success",
    duration: 1000,
  });
}


</script>

<style></style>
