<template>
  <view />
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';

onLoad(() => {
  uni.reLaunch({ url: '/pages/mine/mine' });
});
</script>
