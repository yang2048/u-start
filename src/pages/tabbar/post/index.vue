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

    <view class="w-screen">
      <uv-tabs
        :list="tabList"
        :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :current="current"
      ></uv-tabs>
    </view>
    <view class="m-3 rounded-3 px-5 bg-#fff" v-if="current == 0">
      <uv-list v-for="(item, index) in _.sortBy(tbl_site, ['status', 'group', 'isActive']).reverse()" :key="index">
        <uv-list-item
          :title="item.name"
          :note="`${item.group} -> 资源数：${item.resource ? item.resource : 0}`"
          :rightText="site.default.key == item.key ? '✅' : ''"
          clickable
          show-arrow
          border
          @click="openEdit(item)"
        >
          <template #header>
            <view class="w-8">
              <div
                :class="[
                  item.status
                    ? 'i-mdi-cloud-check-outline'
                    : 'i-mdi-cloud-alert-outline',
                  item.status ? 'c-green' : 'c-amber',
                  'text-5',
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
    <uv-popup
      ref="editModel"
      mode="center"
      custom-style="min-height: 200rpx;max-width: 80%;min-width: 70%;border-radius: 8px"
    >
      <view class="p-5">
        <view>识别码：{{ siteDetail.key }}</view>
        <view>名 称：{{ siteDetail.name }}</view>
        <view>分 组：{{ siteDetail.group }}</view>
        <view>类 型：{{ siteDetail.type }}</view>
        <view>状 态：{{ siteDetail.status }}</view>
        <view>激 活：{{ siteDetail.isActive }}</view>
        <view class="flex justify-evenly pt-5">
          <uv-button type="primary" text="设为默认" @tap="onDefault"></uv-button>
          <uv-button type="warning" text="禁用站点" ></uv-button>
        </view>
      </view>
    </uv-popup>
  </view>
</template>

<script setup lang="ts">
import _ from "lodash";
import { usePlayStore } from "@/store";
import {tbl_site} from "@/constants/config0519.json";

const storePlayer = usePlayStore();

const site = computed(() => {
  return storePlayer.getSite;
});

const current = ref(0)
const editModel = ref();
const siteDetail = ref({
  id: "",
  key: "",
  name: "",
  api: "",
  playUrl: "",
  search: 0,
  group: "",
  status: false,
  type: 0,
  isActive: false,
  resource: 0,
});
const tabList = ref([
  {
    key: "tbl_site",
    name: "影视点播",
  },
  {
    key: "tbl_iptv",
    name: "电视直播",
  },
  {
    key: "tbl_analyze",
    name: "在线解析",
  },
  {
    key: "tbl_drive",
    name: "云盘",
  }
]);

const openEdit = (item: any) => {
  editModel.value.open();
  siteDetail.value = item;
};

const onDefault = () => {
  console.info(siteDetail);
  storePlayer.updateConfig({
    site: {
      default: siteDetail,
    },
  });
  editModel.value.close();

  uni.showModal({
	title: '切换成功',
	content: `源： ${siteDetail.value.name}`,
  confirmText: '前往观看',
  cancelText: '好的',
	success: function (res) {
		if (res.confirm) {
			uni.$uv.route("pages/film/index")
		} else if (res.cancel) {
			console.log('用户点击取消');
		}
    uni.hideToast();
	}
});
};
</script>

<style></style>
