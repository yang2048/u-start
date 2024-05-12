<script setup lang="ts">
import _ from 'lodash';
import { getVodList } from "@/services";
import { useRequest } from "alova";
import { usePlayStore } from "@/store";
import { fetchClassify, fetchList } from "@/utils/cms";

const storePlayer = usePlayStore();

const siteConfig = ref({
  default: {
    categories: "",
    ext: "",
    api: "https://www.39kan.com/api.php/provide/vod/",
    group: "切片",
    id: "1",
    isActive: true,
    key: "39kan",
    name: "39影视",
    playUrl: "",
    search: 1,
    status: false,
    type: 1
  },
  search: "all",
  data: [],
}) as any;
const filmData = ref({
  list: [],
  rawList: [],
}) as any;
const pagination = ref({
  pageIndex: 1,
  pageSize: 36,
  count: 0,
  total: 0,
}); // 分页请求
const filter = ref({
  data: [],
  format: {},
  select: {
    site: "",
    sort: "按更新时间",
    class: "",
    area: "全部",
    year: "全部",
  },
}) as any;
const active = ref({
  site: "",
  nav: null,
  class: 0,
}) as any;

const classConfig = ref({
  data: [{ type_id: 0, type_name: "最新" }],
}) as any;

onLoad(() => {
  loadInit();

  console.info("siteConfig=>",siteConfig.value);
  console.info("filmData=>",filmData.value);
  console.info("pagination=>",pagination.value);
  console.info("active=>",active.value);
  console.info("classConfig=>",classConfig.value);
});

const loadInit = async () => {
  //获取站点信息
  // const data = await fetchSiteActive();
  const defaultSite = siteConfig.value.default;
  // 加载分类
  await getClassList(defaultSite);

  const resLength = await getFilmList(); // 动态加载数据

  if (resLength === 0 || filmData.value.list[0]?.vod_name === "无数据,防无限请求") {
    console.info("无数据,防无限请求");
  }
};

// 获取分类
const getClassList = async (site: any) => {
  try {
    const res = await fetchClassify(site);

    const { pagecount, limit, total, classData, filters } = res;
    const { pageIndex, ...rest } = pagination.value;
    pagination.value = { pageIndex, ...rest, count: pagecount, pageSize: limit, total };
    filter.value.data = filters;

    const classDataFormat = categoriesFilter(classData);
    classConfig.value.data = classDataFormat;

    const classItem = classDataFormat[0];
    active.value.class = classItem["type_id"];
  } catch (err) {
    console.log(err);
  }
};

// 类别过滤
const categoriesFilter = (classData: string[]): string[] => {
  const { categories } = siteConfig.value.default;
  if (!categories || categories.trim() === "") return classData;

  const categoryList = categories.split(",").map((item: any) => item.trim());
  const classDataList = classData.map((item) => item["type_name"]);
  const categoriesInOrder: string[] = [];

  for (const category of categoryList) {
    const isFind = classDataList.indexOf(category);
    if (isFind === -1) continue;

    const foundCategory = classData.find((item) => item["type_name"] === category);
    if (foundCategory) {
      categoriesInOrder.push(foundCategory);
    }
  }

  return categoriesInOrder;
};

// 切换分类
const changeClassEvent = (key) => {
  active.value.class = key;
  classFilter(filter.value.data);
  // filterApiEvent();
  // searchTxt.value = "";
  // infiniteCompleteTip.value = t("pages.film.infiniteLoading.noMore");
  // filmData.value = { list: [], rawList: [] };
  // infiniteId.value++;
  pagination.value.pageIndex = 1;
};


// 过滤条件-选中第一项
const classFilter = (filters:any) => {
  const result = {};

  if (_.has(filters, active.value.class)) {
    filters[active.value.class].forEach((item:any) => {
      result[item.key] = item.value[0]?.v ?? '全部';
    });
  }

  active.value.filter = result;
};

// 获取资源
const getFilmList = async () => {
  const defaultSite = siteConfig.value.default;
  const pg = pagination.value.pageIndex;
  const t = active.value.class;
  const { format } = filter.value;

  console.log(
    `[film] load parameter: ${
      defaultSite.type === 2 || defaultSite.type === 7
        ? JSON.stringify({ ...format })
        : JSON.stringify(format)
    }`
  );

  let length = 0;
  try {
    const res = await fetchList(
      defaultSite,
      pg,
      t,
      defaultSite.type === 2 || defaultSite.type === 7 ? { ...format } : format
    );
    const newFilms = _.differenceWith(res, filmData.value.list, _.isEqual);
    filmData.value.list = [...filmData.value.list, ...newFilms];
    filmData.value.rawList = [...filmData.value.rawList, ...res];
    pagination.value.pageIndex++;
    length = newFilms.length;
  } catch (err) {
    console.error(err);
    length = 0;
  } finally {
    console.log(`[film] load data length: ${length}`);
    return length;
  }
};

// 搜索
const searchEvent = async () => {};

// 切换站点
const changeSitesEvent = async (key: string) => {};

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
      <uv-tabs :list="classConfig.data" keyName="type_name"></uv-tabs>
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
        <view class="grid grid-cols-3 gap-2">
          <view
            v-for="(item, index) in filmData.list"
            :key="index"
            class="justify-center flex-items-center"
          >
            <div class="rounded-md" @click="toPage('pages/play/index', item)">
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
      <!-- <view v-if="vod.list > 0 || loading" class="my-5">
        <uv-load-more :status="loading" />
      </view>
      <view v-if="vod.total == 0 && !loading">
        <uv-empty mode="list"></uv-empty>
      </view> -->
    </view>
  </view>
</template>

<style scoped></style>
