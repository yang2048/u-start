<script setup>
const searchValue = ref("");
const searchList = ref([]);

// 热播映射
const hotTypeMappings = {
  enlightent: {
    hotUpdateTime: () => moment().format("YYYY/MM/DD"),
    hotSource: "tv",
  },
  kuyun: {
    hotUpdateTime: () => moment().format("YYYY-MM-DD"),
    hotSource: 1,
  },
  kylive: {
    hotUpdateTime: () => moment().format("YYYY-MM-DD"),
    hotSource: 0,
  },
};

// 清空搜索历史
const clearSearchHistory = async () => {
  // await clearHistorySearchList();
  searchList.value = [];
};

// 搜索资源
const onSearch = async () => {
  // searchValue.value = item;
  //TODO 添加历史搜索记录
  // console.info(searchValue.value)
  uni.$uv.route("/pages/film/index", {
    level: "all",
    wd: searchValue.value,
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

      <uni-section title="搜索历史" type="line">
        <template #right>
          <uv-icon name="trash" :size="20"></uv-icon>
        </template>
      </uni-section>
      <view class="p-3 m-2 flex flex-wrap gap-2">
        <uv-tags text="标签" plain size="mini" type="warning"></uv-tags>
        <uv-tags text="标签" plain size="mini" type="warning"></uv-tags>
        <uv-tags text="标签" plain size="mini" type="warning"></uv-tags>
        <uv-tags text="标签" plain size="mini" type="warning"></uv-tags>
        <uv-tags text="标签" plain size="mini" type="warning"></uv-tags>
        <uv-tags text="标签" plain size="mini" type="warning"></uv-tags>
      </view>
    </view>
    <!-- 热门搜索 -->
    <view class="px-3 my-3 rounded-3 bg-#fff">
      <uni-section title="热门排行" type="line">
        <template #right>
          <uv-icon name="eye" :size="20"></uv-icon>
        </template>
      </uni-section>
      <view class="p-3 m-2">
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
