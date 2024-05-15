<script>

</script>
<template>
  <view>
    <uv-navbar placeholder>
      <template #left>
        <view class="uv-nav-slot">
          <navigator open-type="navigateBack">
            <uv-icon name="arrow-left" size="20"></uv-icon>
          </navigator>

          <uv-line
            direction="column"
            :hairline="false"
            length="16"
            margin="0 8px"
          ></uv-line>
          <navigator url="/pages/tabbar/home/index" open-type="switchTab">
            <uv-icon name="home" size="20"></uv-icon>
          </navigator>
        </view>
      </template>
      <!-- <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template> -->
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
  </view>
</template>

<style scoped lang="scss">
@mixin flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: $direction;
}
.uv-nav-slot {
  @include flex;
  align-items: center;
  justify-content: space-between;
  border-width: 0.5px;
  border-radius: 100px;
  border-color: #dadbde;
  padding: 3px 7px;
  opacity: 0.8;
}
</style>
