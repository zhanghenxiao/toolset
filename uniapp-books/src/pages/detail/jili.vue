<template>
	<view>
		<button @click="showAd">看广告解锁内容</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			rewardAd: null
		}
	},
	onReady() {
		// 用户同意隐私之后，再初始化广告！
		this.initAd()
	},
	methods: {
		initAd() {
			// adpid替换成你后台uni-ad广告位ID
			this.rewardAd = uni.createRewardedVideoAd({
				adpid: "1234567890"
			})
			// 预加载广告
			this.rewardAd.load()
			// 广告加载成功
			this.rewardAd.onLoad(() => {
				console.log("广告加载成功")
			})
			// 广告加载失败
			this.rewardAd.onError((err) => {
				console.error("广告加载失败", err)
			})
			// 广告关闭回调
			this.rewardAd.onClose((res) => {
				// res.isEnded = true：用户完整看完广告，可以发放奖励
				if (res.isEnded) {
					console.log("看完广告，发放奖励，解锁内容")
					// 在这里写你的业务逻辑：解锁章节、解锁功能
				}
				// 看完/关闭后，立刻预加载下一条广告
				this.rewardAd.load()
			})
		},
		async showAd() {
			try {
				await this.rewardAd.show()
			} catch (err) {
				console.log("广告显示失败，重新加载")
				this.rewardAd.load()
			}
		}
	}
}
</script>
