<template>
	<view>
		<view class="top-context">
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="24">
					<view>
						<u-swiper :list="imgList" interval="5000" duration="1000" :circular="true" height="200"></u-swiper>
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="tit">
			<u-grid :border="false">
				<u-grid-item @click="clickItem('apply')" v-for="(baseListItem, baseListIndex) in baseList" :key="baseListIndex + '1'">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="baseListItem.name1" :size="22" width="80rpx" height="80rpx"></u-icon>
					<text class="grid-text">{{baseListItem.title1}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	
	const uToast = ref(null)
	
	const imgList = ref([
		'/static/tabbar/bg1.jpg',
		'/static/tabbar/bg2.jpg'
	])
	
	const baseList = ref([{
		name1: '/static/tabbar/apply.png',
		title1: '参观申请',
	}])
	
	const clickItem = (type) => {
		if (type === 'apply') {
			uToast.value.show({
				title: '参观申请页面',
				type: 'success'
			});
			uni.navigateTo({
				url: "/pages/visit/apply/apply"
			});
		}
	}
</script>

<style>
	.tit {
		
	}
	.grid-text {
		font-size: 16px;
		color: #909399;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>
