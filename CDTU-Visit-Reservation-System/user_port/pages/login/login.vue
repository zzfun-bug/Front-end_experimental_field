<template>
	<view class="content">
		<view class="logo">
			<u-image src="/static/tabbar/bg1.jpg" width="100px" height="100px"></u-image>
		</view>
		<view class="text-area">
			<text class="title">登录后即可继续进行预约申请</text>
		</view>
		<view class="btn">
			<u-button type="success" icon="weixin-fill" text="微信一键授权登录" @click="login" :disabled="isDsabled"
				:loading="isLoading" loadingText="授权登录中..."></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 按钮是否显示加载中特效
				isLoading: false,
				// 禁用按钮
				isDsabled: false
			}
		},
		onLoad() {},
		onShow() {

		},
		methods: {
			login() {
				// 开启加载特效
				this.isLoading = true;
				this.isDsabled = true;
				// 禁用按钮
				wx.login({
					success(res) {
						if (res.code) {
							// 测试临时凭证是否正确获取
							console.log(res.code)
							uni.request({
								url: 'http://localhost:8080/cdtu-visit/wx/login',
								method: 'GET',
								data: {
									code: res.code
								},
								success: (res) => {
									// 关闭特效:
									this.isLoading = false;
									this.isDsabled = false;
									// res.data：响应数据
									console.log(res.data)
									// 本地缓存：参考官方文档：https://uniapp.dcloud.net.cn/api/storage/storage.html#setstoragesync
									uni.setStorageSync('userId', res.data);
									// 在其他页面中，可以随时使用uni.getStorageSync(KEY)从本地缓存中同步获取指定 key 对应的内容。
									//  如：uni.getStorageSync('userId');获取openid
									uni.switchTab({
										url: '/pages/home/home'
									});
								}
							});
						} else {
							console.log('登录失败！' + res.errMsg)
						}
					}
				})
			}
		}

	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 100rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 30rpx;
		color: #8f8f94;
	}

	.btn {
		height: 400rpx;
		width: 400rpx;
		margin-top: 40rpx;
	}
</style>