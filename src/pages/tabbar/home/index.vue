<script setup lang="ts">
import usePager from "@/hooks/pager";
import type { HomeData, SearchParams } from "@/api/common/model";
import type { PostList } from "@/api/post/model";
// import { config } from "@/constants";

const { list, pager, loadData, loadMore } = usePager<PostList>("demo");

const homeData: Ref<HomeData> = ref({} as HomeData);
const model = reactive({
  city: ["山东省", "潍坊市", ""],
  showCitySelect: false,
});

// 组装查询参数
const params = computed(() => {
  const filter = tabs[current.value].value;
  console.log("tab-" + filter);
  const result: SearchParams = {
    kwargs: {
      domain: [
        ["is_published", "=", true],
        ["filter", "=", filter],
      ],
      fields: [
        "id",
        "name",
        "tag_ids/name",
        "published_date",
        "view_count",
        "image_url",
        "author_id/name",
      ],
      limit: pager.limit,
      offset: pager.offset,
    },
  };
  return result;
});

const config = ref({
  noticeList: ["寒雨连江夜入吴", "平明送客楚山孤", "洛阳亲友如相问", "一片冰心在玉壶"],
  bannerList: [
    {
      url: "https://cdn.uviewui.com/uview/resources/video.mp4",
      title: "昨夜星辰昨夜风，画楼西畔桂堂东",
      poster: "https://cdn.uviewui.com/uview/swiper/swiper1.png",
    },
    {
      url: "https://cdn.uviewui.com/uview/swiper/swiper2.png",
      title: "身无彩凤双飞翼，心有灵犀一点通",
    },
    {
      url: "https://cdn.uviewui.com/uview/swiper/swiper3.png",
      title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
    },
  ],
  gridList: [
    {
      name: 'film',
      title: "在线影视",
      icon: "i-solar-chat-round-video-broken",
      link: "/pages/film/index",
      badge: "NEW",
    },
    {
      name: 'iptv',
      title: "电视直播",
      icon: "i-iconoir-apple-imac-2021",
      link: "/pages/news/index",
    },
    {
      name: 'spider',
      title: "解析",
      icon: "i-mdi-cube-scan",
      link: "/pages/mine/memo",
    },
    {
      name: 'pan',
      title: "云盘",
      icon: "i-mdi-cast-audio-variant",
      link: "/pages/mine/message",
    },
  ],
})

onLoad((options) => {
  // model.id = options.id
  loadData(params);
});

onReachBottom(() => {
  console.info("onReachBottom");
  loadMore();
});
onPullDownRefresh(() => {
  list.value = [];
  pager.offset = 0;
  loadData(params);
});

const tabs = [
  {
    name: "标签",
    value: "1",
  },
  {
    name: "标签",
    value: "2",
  },
  {
    name: "标签",
    value: "3",
  },
];
const current = ref(0);
const change = (index: number) => {
  current.value = index;
  list.value = [];
  pager.offset = 0;
  loadData(params);
};

const onCityChange = (result: any) => {
  model.city = [result.province.name, result.city.name, result.area.name];
};

const toPage = (page:string) => {
  uni.$uv.route(page);
};
</script>

<template>
  <view class="container">
    <uv-navbar safeAreaInsetTop fixed placeholder>
      <template #left>
        <view class="flex center" @click="model.showCitySelect = true">
          <view class="text-16px">{{ model.city[1] }}</view>
          <uv-icon name="arrow-down" size="28" color="#666" class="mx-1"></uv-icon>
        </view>
      </template>
      <template #center>
        <view class="ml-3">
          <uv-search
            placeholder="搜索"
            disabled
            :showAction="false"
            @click="toPage('pages/film/index')"
            :customStyle="{ width: '75%' }"
          ></uv-search>
        </view>
        <!-- <view class="flex relative mr-2" @click="toMessageList">
          <div class="i-tdesign-cat"></div>
          </view> -->
      </template>
    </uv-navbar>
    <view class="px-3">
      <view>
        <view class="my-3">
          <uv-swiper
            :list="config.bannerList"
            keyName="url"
            height="180"
            previousMargin="30"
            nextMargin="30"
            circular
            radius="5"
          ></uv-swiper>
        </view>

        <view class="my-3">
          <uv-notice-bar :text="config.noticeList" direction="column"></uv-notice-bar>
        </view>

        <view class="my-3 rounded-3 bg-#fff py-3">
          <uv-grid :col="4" :border="false">
          <uv-grid-item v-for="(item, index) in config.gridList" :key="index" @click="toPage(item.link)">
            <view :class="[item.icon, 'text-40px', 'color-coolgray-700']"></view>
            <uv-badge :value="item.badge" :absolute="true" :offset="[0, 0]" customStyle="margin-left: 4px;" />
            <text class="text-#333 text-13px">{{item.title}}</text>
          </uv-grid-item>
        </uv-grid>
        </view>

        <view class="my-3 flex">
          <view class="main-btn mr-2" @click="toPage('pages/film/index')">
            <view class="i-iconoir-www text-20px"></view>
            <view class="ml-1">页面</view>
          </view>
          <view class="main-btn" @click="toPage('pages/film/index')">
            <view class="i-iconoir-xray-view text-20px"></view>
            <view class="ml-1">组件</view>
          </view>
        </view>

        <view class="my-3 rounded-3 bg-#fff">
          <uni-section title="热门新闻" @click="toPage('pages/film/index')" type="line"></uni-section>
          <view class="">
            <uv-tabs
              :list="tabs"
              :scrollable="false"
              :activeStyle="{
                color: '#303133',
                fontWeight: 'bold',
                transform: 'scale(1.05)',
              }"
              @change="change"
            ></uv-tabs>
          </view>
          <view v-for="(item, index) in list" :key="index" class="news-item-box">
            <NewsListItem :data="item" />
          </view>
        </view>
      </view>

      <view v-if="list.length > 0 || pager.status == 'loading'" class="my-5">
        <uv-load-more :status="pager.status" @loadmore="loadData" />
      </view>
      <view v-if="list.length == 0 && pager.status != 'loading'">
        <uv-empty mode="list" :icon="sysConfig.emptyImg"></uv-empty>
      </view>
    </view>

    <view>
      <CitySelect
        v-model="model.showCitySelect"
        :only-city="true"
        :default-region="model.city"
        @city-change="onCityChange"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  // .right-item {
  //   position: relative;
  //   color: #ffffff;
  //   display: flex;
  // }

  .main-btn {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    border-radius: 4px;
    height: 60px;
    width: 49.9%;
    color: #555; // #243b82;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 1px 3px -1px rgba(140, 190, 238, 0.2);
    background-image: linear-gradient(
      45deg,
      rgba(0, 255, 255, 0.15) 25%,
      rgba(49, 87, 182, 0.15) 50%,
      rgba(174, 109, 109, 0.15) 75%
    );
    background-size: 100%;
  }

  ::v-deep .u-grid-item-box {
    padding: 6px 16px !important;
  }
}
</style>
