<script lang="ts">
export default { name: 'WebViewPage' }
</script>
<script setup lang="ts">
const url = ref('')

onLoad((options:any) => {
  url.value = options.url
})
</script>

<template>
  <view class="container">
    <uv-no-network></uv-no-network>
    <view v-if="url">
      <web-view :src="url"></web-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: #fff;
}
</style>
