<script setup>
const keyword = ref('')
</script>

<template>
  <view>
    <view class="p-5 bg-#fff">
    <uv-search placeholder="请输入搜索内容" v-model="keyword"></uv-search>
    </view>
    <!-- 热门搜索 -->
    <view class="my-3 pb-8 rounded-3 bg-#fff">
      <uni-section title="热门搜索" type="line">
        <template #right>
          <uv-icon name="list-dot" size="20"></uv-icon>
        </template>
      </uni-section>
      <uv-empty
        mode="data"
        icon="https://cdn.uviewui.com/uview/empty/data.png"
      ></uv-empty>
    </view>
  </view>
</template>
