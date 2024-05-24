<script setup>
import _ from "lodash";
import { useCustomStore } from "@/store";
import { fetchFullHot } from "@/utils/cms";
import { useDateFormat, useNow } from "@vueuse/core";

const storeCustom = useCustomStore();

const history = computed(() => {
  return storeCustom.getHistory;
});
const searchValue = ref("");
const searchList = ref([]);
const tabsList = ref([
  {
    id: 0,
    name: "推荐",
    badge: {
      isDot: true,
    },
  },
  {
    id: 1,
    name: "爱奇艺",
  },
  {
    id: 2,
    name: "优酷",
  },
  {
    id: 3,
    name: "芒果TV",
  },
]);
const hotParam = ref({
  date: "",
  type: 0,
});
const hotList = ref([]);

onLoad(() => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const YMD =
    yesterday.getFullYear() +
    "/" +
    (yesterday.getMonth() + 1) +
    "/" +
    yesterday.getDate();
  hotParam.value.date = "2024-05-20";
  getFullHot();
});

const searchHot = async (title) => {
  searchValue.value = title;
  await onSearch();
};

const changeTabEvent = (e) => {
  hotParam.value.type = e.id;
  getFullHot();
};

// 清空搜索历史
const clearSearchHistory = async () => {
  await storeCustom.restHistory();
  searchList.value = [];
};

const getFullHot = async () => {
  try {
    const res = await fetchFullHot(hotParam.value.date, hotParam.value.type);
    hotList.value = res.data;
    // console.info(hotList.value);
  } catch (err) {
    console.log(err);
  }
};

// 搜索资源
const onSearch = async () => {
  storeCustom.updateHistory(searchValue.value);
  uni.$uv.route({
    type: "redirect",
    url: "/pages/film/index",
    params: {
      level: "all",
      wd: searchValue.value,
    },
  });
};
</script>

<template>
  <view>
    <view class="p-5 bg-#fff">
      <uv-search
        placeholder="请输入搜索内容"
        v-model="searchValue"
        clearabled
        focus
        animation
        @search="onSearch"
        @custom="onSearch"
      ></uv-search>
    </view>

    <view v-show="history.length > 0" class="px-3 pb-3 rounded-3 bg-#fff">
      <uni-section title="搜索历史" type="line">
        <template #right>
          <uv-icon name="trash" :size="20" @click="clearSearchHistory"></uv-icon>
        </template>
      </uni-section>
      <view class="m-2 flex flex-wrap gap-2">
        <view v-for="(item, index) in history" :key="index">
          <uv-tags :text="item" plain size="mini" type="warning" @click="searchHot(item)"></uv-tags>
        </view>
      </view>
    </view>
    <!-- 热门搜索 -->
    <view class="px-3 pb-5 my-3 rounded-3 bg-#fff">
      <uni-section title="热门排行" type="line">
        <template #right>
          <uv-icon name="eye" :size="20"></uv-icon>
        </template>
      </uni-section>
      <view class="w-screen">
        <uv-tabs :list="tabsList" keyName="name" @change="changeTabEvent"></uv-tabs>
      </view>
      <view class="grid grid-cols-2 gap-4">
        <view v-for="(item, index) in hotList" :key="index">
          <view class="text-3" @click="searchHot(item.epg)">
            <text :class="[item.rk <= 5 ? 'text-red' : '']"
              >{{ item.rk }} {{ item.epg }} {{ item.hot }}</text
            >
          </view>
        </view>
      </view>
      <view class="p-3 m-2" v-if="hotList.length == 0">
        <uv-empty
          mode="data"
          icon="https://cdn.uviewui.com/uview/empty/data.png"
        ></uv-empty>
      </view>
    </view>
    <!-- 豆瓣热门 -->
    <view class="px-3 my-3 rounded-3 bg-#fff">
      <uni-section title="豆瓣热门" type="line">
        <template #right>
          <uv-icon name="reload" :size="20"></uv-icon>
        </template>
      </uni-section>
      <view class="p-3 m-2">
        <uv-empty
          mode="data"
          icon="https://cdn.uviewui.com/uview/empty/data.png"
        ></uv-empty>
      </view>
    </view>
  </view>
</template>
