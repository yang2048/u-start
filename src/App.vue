<script setup lang="ts">
import { useAppStore } from '@/store/app'
// import { setupPermission } from '@/permission'

const appStore = useAppStore()

onLaunch(() => {
	// #ifdef MP-WEIXIN
  uni.setEnableDebug({
    enableDebug: true,
  })
	// #endif

  console.log('App Launch')
  // #ifndef H5
  appStore.initSystemInfo()
  // #endif
  // setupPermission()
})

onShow(() => {
  // App Show
  console.log('App Show')
  // #ifndef H5
  // appStore.checkUpdate()
  // #endif
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
// 每个页面都会加载
@import '@/styles/index.scss';
</style>
