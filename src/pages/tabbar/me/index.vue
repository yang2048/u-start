
<script setup lang="ts">
import type { UserData } from '@/api/user/model'
import UserApi from '@/api/user'
import { isLogin, toLogin } from '@/utils/public'
import { useUserStore } from '@/store/user'

const showWechat = ref()
const wx = ref('yyovo123')
const model: Ref<UserData> = ref({
  favor_count: 0,
  follow_count: 0,
  order_count: 0,
} as UserData)

const userStore = useUserStore()
const userInfo = computed(() => {
  return userStore.getUserInfo
})

const buildVersion = computed(() => {
  return 20240524
})

onShow(() => {
  if (isLogin()) {
    getUserData()
  }
})

onPullDownRefresh(() => {
  console.log('refresh')
  if (isLogin()) {
    getUserData()
  } else {
    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 500)
  }
})

const open = () => {
  showWechat.value.open();
}

const getUserData = async () => {
  // model.value = await UserApi.getUserData()
  uni.stopPullDownRefresh()
}

const logoutDlgShow = ref(false)
const confirm = async () => {
  await userStore.logout()
  logoutDlgShow.value = false
}

const to = (page: string) => {
  if (page === 'login') {
    toLogin()
  } else if (page === 'logout') {
    logoutDlgShow.value = true
  } else {
    let url = `/package/me/${page}`
    uni.$uv.route(url)
  }
}

const onCopy = () => {
  uni.setClipboardData({
    data: wx.value,
    success: function () {
      uni.showToast({
        title: '复制微信号成功',
        icon: 'success',
      })
    },
  })
}

const tools = reactive([
  {
    name: '功能',
    icon: 'i-iconoir-pc-check',
  },
  {
    name: '功能',
    icon: 'i-iconoir-shield-add',
  },
  {
    name: '功能',
    icon: 'i-iconoir-calendar',
  },
  {
    name: '功能',
    icon: 'i-iconoir-search-engine',
  }
])

const btnStyle = reactive({
  padding: '0px 16px',
  border: 'none',
  color: '#987033',
  background: '#efe0ca',
  height: '36px',
  lineHeight: '36px',
})
</script>

<template>
  <view class="user-container">
    <view class="absolute">
      <div class="w100vh h-vh bg-gradient-to-bl from-#FFF1EB to-#ACE0F9"></div>
    </view>
    <view class="relative mx-4">
      <view class="user-box">
        <view class="flex-box mt-20">
          <view class="flex justify-center items-center rd-50% bg-white">
            <image class="w-20 h-20 rd-50%" src="/static/images/me/avatar.png" />
          </view>
          <!-- <text v-if="userInfo.id" class="c-black ml-3">{{ userInfo.name }}</text>
          <text v-else class="c-black ml-3" @click="to('login')">点击登录</text> -->
        </view>
      </view>
      <view class="user-info-box mb-4">
        <view class="bottom margin-top">
          <view class="flex-box justify-around">
            <view class="u-flex-col u-row-center u-col-center" @click="to('sample')">
              <view class="number">{{ model.favor_count }}</view>
              <view class="color-#666 text-12px">收藏</view>
            </view>
            <view class="u-flex-col u-row-center u-col-center" @click="to('sample')">
              <view class="number">{{ model.follow_count }}</view>
              <view class="color-#666 text-12px">关注</view>
            </view>
            <view class="u-flex-col u-row-center u-col-center" @click="to('order')">
              <view class="number">{{ model.order_count }}</view>
              <view class="color-#666 text-12px">预约</view>
            </view>
          </view>
        </view>
      </view>
      <view class="vip-box action-box" style="background-color: #faecda">
        <view class="flex-box">
          <uv-icon name="integral" size="30px" color="rgb(152, 112, 51)"></uv-icon>
          <view class="flex flex-col flex-1 ml-2">
            <view class="color-#987033 font-bold">U-Starter会员</view>
            <view class="text-12px">成为会员享专属权益</view>
          </view>
          <uv-button shape="circle" :hair-line="false" :custom-style="btnStyle">立即开通</uv-button>
        </view>
      </view>
      <view class="action-box">
        <uv-grid :col="4" :border="false">
          <uv-grid-item v-for="(item, index) in tools" :key="index">
            <view :class="item.icon" style="font-size: 24px" />
            <view class="text-12px mt-1 color-#666">{{ item.name }}</view>
          </uv-grid-item>
        </uv-grid>
      </view>

      <view class="action-box">
      	<uv-cell-group>
          <uv-cell icon="setting-fill" title="个人设置" isLink></uv-cell>
          <uv-cell icon="server-man" title="微信客服" isLink @click="open"></uv-cell>
          <uv-cell title="关于我们" isLink @click="to('about')">
            <template #icon>
              <view class="i-iconoir-info-empty text-17px mr-1"></view>
            </template>
          </uv-cell>
          <uv-cell title="退出登录" isLink @click="to('logout')">
            <template #icon>
              <view class="i-ant-design-logout-outlined text-17px mr-1"></view>
            </template>
          </uv-cell>
        </uv-cell-group>
      </view>
      <div class="flex justify-center items-end text-sm text-coolgray">
          版本: v0.0.{{ buildVersion }}
        </div>
    </view>
    
    <uv-modal
      v-model="logoutDlgShow"
      show-cancel-button
      :async-close="true"
      content="确定要退出？"
      @confirm="confirm"
    ></uv-modal>
    <uv-popup ref="showWechat" mode="center" closeable custom-style="height: 500rpx;width: 500rpx">
      <view class="info-box mt-3">
        <view style="widows: 160px; height: 160px">
          <uv-image width="160px" height="160px" src="https://cdn.jsdelivr.net/gh/yang2048/picx-images-hosting@master/img/omCUv5cAgS78kerYyuXJNEZaheAY.jpg"></uv-image>
        </view>
        <uv-button
          class="mt-3"
          :custom-style="{
            padding: '0px 40px',
            height: '34px',
            color: '#FFF',
            background: '#243b82',
            border: 'none',
          }"
          color="primary"
          :hair-line="false"
          size="mini"
          shape="circle"
          @click="onCopy"
          >复制微信号</uv-button
        >
        <view class="text-12px color-#333 mt-1"> 客服微信号: {{ wx }} </view>
      </view>
    </uv-popup>
  </view>
</template>
<style lang="scss" scoped>
.user-container {
  background-color: #fafafa;
  position: relative;
  z-index: 1;
  .settings-btn {
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .user-box {
    padding: 10px;
  }
  .user-info-box {
    width: 100%;
    background-color: transparent;
    padding: 10px;
    .number {
      font-size: 20px;
      font-weight: bold;
      margin: 3px;
    }
  }
  .action-box {
    padding: 10px;
    color: #555;
    background-color: #fff;
    border-radius: 10rpx;
    // box-shadow: 0px 0px 10px -5px rgba(84, 84, 84, 0.2);
    box-shadow: 0px 0px 4px -1px rgba(140, 190, 238, 0.2);
    margin-bottom: 16px;
  }
  ::v-deep .u-grid-item-box {
    padding: 10px 4px !important;
  }
  ::v-deep .u-cell {
    color: #666;
    padding: 8px;
    .u-cell_title {
      color: #333;
      font-size: 14px !important;
    }
  }

  .info-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 30px;
    text-align: center;
  }
}
</style>
