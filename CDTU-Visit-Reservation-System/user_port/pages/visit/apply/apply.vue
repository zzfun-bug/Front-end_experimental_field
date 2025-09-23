<template>
	<view>
		<view class="top-context">
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="12">
					<view>
						<xweek v-on:back="changeBack"></xweek>
					</view>
				</u-col>
			</u-row>
		</view>
		<view class="text-content">
			<text v-if="selectedDate">{{ selectedDate }}</text>
			<text v-else>请选择日期</text>
		</view>
		<view class="container">
			<u-grid col="2" :border="false">
				<u-grid-item v-for="(item, index) in dataList" :key="index" class="grid-item"
					@click="handleGridItemClick(item)">
					<view class=" grid-item-content">
						<text class="time-period">{{ item[0] }}</text>
						<text class="time-slot">{{ item[1] }}</text>
						<text class="availability">{{ item[2] }}</text>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>


<script>
	import xweek from '@/components/junkj-xweek/xweek.vue'
	export default {
		// 注册组件
		components: {
			xweek
		},
		data() {
			return {
				selectedDate: '',
				baseList: [{
					name: '/static/tabbar/apply.png',
					title: '观申请'
				}, ],
				dataList: [
					['上午', '09:00-10:00', '可预约'],
					['上午', '10:30-12:00', '可预约'],
					['下午', '13:30-15:00', '可预约'],
					['下午', '15:30-17:00', '已预约']
				]
			}
		},
		methods: {
			// 在组件上点击时间，会返回选择的年月日
			changeBack: function(d) {
				console.log(d);
				this.selectedDate = d;
			},
			handleGridItemClick: function(item) {
				//构造要传递的数据
				const visitDate = this.selectedDate;
				const timeSlot = item[1];
				//确认
				console.log('visitDate:', visitDate);
				console.log('timeSlot:', timeSlot);
				uni.navigateTo({
					url: `/pages/message/message?visitDate=${visitDate}&timeSlot=${timeSlot}`
				})
			}
		}
	}
</script>

<style>
	.text-content {
		display: block;
		font-size: 40px;
		text-align: center;
		color: black;
		margin-top: 25px;
	}

	.container {
		padding: 20px;
		margin-top: 15px;
	}

	.grid-item-content {
		display: flex;
		width: 70%;
		border: 1px solid #c7c7c7;
		margin-top: 15px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.time-period,
	.time-slot,
	.availability {
		font-size: 16px;
		color: #333333;
		margin: 5px 0;
	}

	.availability {
		color: #57AEFF;
	}
</style>