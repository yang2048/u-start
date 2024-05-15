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
      <uv-list v-for="(item, index) in _.sortBy(tbl_site, ['isActive'])">
        <uv-list-item
          :title="item.name"
          :note="`${item.group} -> 资源数：${item.resource? item.resource : 0}`"
          rightText=""
          clickable
          show-arrow
          @click="openEdit(item)"
        >
          <template #header>
            <view class="w-5 px-2">
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
    <uv-popup ref="editModel" mode="center" :close-on-click-overlay="false" closeable custom-style="min-height: 200rpx;max-width: 80%">
			<view class="p-5">
				<view>里面是很比较多或复杂的内容...</view>
				<view>里面是很比较多或复杂的内容...</view>
				<view>里面是很比较多或复杂的内容...</view>
				<view>里面是很比较多或复杂的内容...</view>
				<view>里面是很比较多或复杂的内容...</view>
        <view>{{siteDetail}}</view>
        <view><button @click="onDefault">默认</button></view>
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

const onDefault = (item: any) => {
  storePlayer.updateConfig({
    site: {
      default: item,
    },
  });
}


</script>

<style></style>
