<script setup lang="ts">
import _ from "lodash";
import { usePlayStore } from "@/store";
import { fetchClassify, fetchList } from "@/utils/cms";

const storePlayer = usePlayStore();

const filmData = ref({
  list: [],
  rawList: [],
  pageStatus: "loadmore",
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

const siteConfig = computed(() => {
  return storePlayer.getSite;
});

onLoad(() => {
  loadInit();

  console.info("siteConfig=>", siteConfig.value);
  console.info("filmData=>", filmData.value);
  console.info("pagination=>", pagination.value);
  console.info("active=>", active.value);
  console.info("classConfig=>", classConfig.value);
});

const loadInit = async () => {
  //获取站点信息
  // const data = await fetchSiteActive();
  const defaultSite = siteConfig.value.default;
  // 加载分类
  getClassList(defaultSite);

  const resLength = await getFilmList(); // 动态加载数据

  if (resLength === 0 || filmData.value.list[0]?.vod_name === "无数据,防无限请求") {
    console.info("无数据,防无限请求");
    uni.showToast({
      title: `没有更多数据`,
      icon: "error",
    });
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

    const classItem: any = classDataFormat[0];
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
  const classDataList = classData.map((item: any) => item["type_name"]);
  const categoriesInOrder: string[] = [];

  for (const category of categoryList) {
    const isFind = classDataList.indexOf(category);
    if (isFind === -1) continue;

    const foundCategory = classData.find((item: any) => item["type_name"] === category);
    if (foundCategory) {
      categoriesInOrder.push(foundCategory);
    }
  }

  return categoriesInOrder;
};

// 切换分类
const changeClassEvent = (item: any) => {
  active.value.class = item.type_id;
  classFilter(filter.value.data);
  // filterApiEvent();
  // searchTxt.value = "";
  filmData.value = { list: [], rawList: [] };
  // infiniteId.value++;
  pagination.value.pageIndex = 1;
  console.info("切换分类", item);
  const resLength = getFilmList();
};

// 过滤条件-选中第一项
const classFilter = (filters: any) => {
  const result: any = {};

  if (_.has(filters, active.value.class)) {
    filters[active.value.class].forEach((item: any) => {
      result[item.key] = item.value[0]?.v ?? "全部";
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

  filmData.value.pageStatus = "loading";
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

    if (length === 0) {
      filmData.value.pageStatus = "nomore";
    } else {
      filmData.value.pageStatus = "loadmore";
    }
  } catch (err) {
    console.error(err);
    length = 0;
    filmData.value.pageStatus = "nomore";
  } finally {
    console.log(`[film] load data length: ${length}`);
    return length;
  }
};

// 切换站点
const changeSitesEvent = async (key: string) => {};

const onScrollToLower = async () => {
  try {
    if (filmData.value.pageStatus == "loadmore") {
      const resLength = await getFilmList(); // 动态加载数据
      uni.showToast({
        title: `第 ${pagination.value.pageIndex} 页`,
        icon: "success",
        mask: true,
      });
    }
    console.error("下一页" + filmData.value.pageStatus);
  } catch (err) {
    console.error(err);
  } finally {
    uni.hideLoading();
  }
};

const loadData = () => {
  console.info("loadData");
};

//播放
const toPage = (page: string, item?: any) => {
  storePlayer.updateConfig({
    data: {
      info: item,
      ext: { site: active.site },
    },
  });
  uni.$uv.route(page);
};

const trigger = (e:any) => {
  if (e.item.text == '换源') {
    uni.$uv.route({url: "/pages/tabbar/post/index", type:"tab"});
  }
  if (e.item.text == '记录') {
    uni.$uv.route("/pages/search/index");
  }
}
</script>

<template>
  <u-no-network></u-no-network>
  <view class="container">
    <uv-navbar placeholder>
      <template #left>
        <view class="uv-nav-slot">
          <navigator open-type="navigateBack">
            <uv-icon name="arrow-left" size="22"></uv-icon>
          </navigator>
          <uv-line
            direction="column"
            :hairline="false"
            length="16"
            margin="0 8px"
          ></uv-line>
          <navigator url="/pages/tabbar/home/index" open-type="switchTab">
            <uv-icon name="home" size="22"></uv-icon>
          </navigator>
        </view>
      </template>
      <template #center>
        <view class="ml-3">
          <uv-search
            placeholder="搜索"
            disabled
            :showAction="false"
            @click="toPage('pages/search/index')"
            :customStyle="{ width: '75%' }"
          >
          </uv-search>
        </view>
      </template>
    </uv-navbar>

    <view class="">
      <scroll-view
        scrollY
        enableFlex
        class="h-vh"
        :lowerThreshold="5"
        @scrolltolower="onScrollToLower"
      >
        <sticky-section>
          <sticky-header class="fixed z-89 bg-#fff">
            <!-- 分类 -->
            <view class="w-screen">
              <uv-tabs
                :list="classConfig.data"
                keyName="type_name"
                @change="changeClassEvent"
              ></uv-tabs>
            </view>
          </sticky-header>

          <!-- 视频列表 -->
          <list-view>
            <view class="pt-12 px-3 grid grid-cols-3 gap-2">
              <view
                class="justify-center flex-items-center"
                v-for="(item, index) in filmData.list"
                :key="index"
                style="background-color: #fff"
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
          </list-view>

          <view
            v-if="filmData.list > 0 || filmData.pageStatus == 'loading'"
            class="pt-3 pb-8"
          >
            <uv-load-more :status="filmData.pageStatus" @loadmore="loadData" />
          </view>
          <view
            v-if="filmData.list == 0 && filmData.pageStatus == 'nomore'"
            class="py-10"
          >
            <uv-empty
              mode="list"
              icon="http://cdn.uviewui.com/uview/empty/list.png"
            ></uv-empty>
            <navigator url="/pages/tabbar/post/index" open-type="switchTab">
              <button type="default">更换数据源</button>
            </navigator>
          </view>
        </sticky-section>
      </scroll-view>
    </view>

    <next-drag-fab
            ref="nextDragFabRef"
            :isDock="true"
            :content="[
            {
                text: '记录',
                active: false,
                iconPath: 'https://www.yisuxiao.com/static/server/common/tab/tab1-0.png', 
                selectedIconPath: 'https://www.yisuxiao.com/static/server/common/tab/tab1-1.png'},
            {
                text: '换源',
                active: false,
                iconPath: 'https://www.yisuxiao.com/static/server/common/tab/tab2-0.png', 
                selectedIconPath: 'https://www.yisuxiao.com/static/server/common/tab/tab2-1.png'},
            ]"
            horizontal="right"
            vertical="bottom"
            direction="horizontal"
            defpositon="rb"
            @trigger="trigger"
        />
  </view>
</template>

<style scoped></style>
