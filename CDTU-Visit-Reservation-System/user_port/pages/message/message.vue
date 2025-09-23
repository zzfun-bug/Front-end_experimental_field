<template>
	<view class="u-page">
		<view class="u-demo-block">
			<view class="u-demo-block__content">
				<u-form labelPosition="left" :model="formModel" ref="form">
					<u-form-item label="参观时间" prop="visitDate" borderBottom>
						<u-input v-model="formModel.visitDate" :disabled="true" placeholder="今日时间"></u-input>
					</u-form-item>
					<u-form-item label="单位名称" prop="visitUnit" borderBottom>
						<u-input v-model="formModel.visitUnit" placeholder="请输入单位名称"></u-input>
					</u-form-item>
					<u-form-item label="单位性质" prop="visitNature" borderBottom @click="showVisitNatureDropdown = true">
						<u-input v-model="selectedVisitNature" :disabled="true" placeholder="请选择单位性质"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="来访人数" prop="visitNum" borderBottom>
						<u-input v-model="formModel.visitNum" placeholder="请输入来访人数"></u-input>
					</u-form-item>
					<u-form-item label="车牌号" prop="visitCar" borderBottom>
						<u-input v-model="formModel.visitCar" placeholder="请输入车牌号"></u-input>
					</u-form-item>
					<u-form-item label="联系人" prop="contactName" borderBottom>
						<u-input v-model="formModel.contactName" placeholder="请输入联系人"></u-input>
					</u-form-item>
					<u-form-item label="联系电话" prop="contactPhone" borderBottom>
						<u-input v-model="formModel.contactPhone" placeholder="请输入联系电话"></u-input>
					</u-form-item>
				</u-form>
				<u-button type="primary" text="提交" customStyle="margin-top: 20rpx; width: 97%; border-radius: 15rpx"
					@click="showSubmitDialog"></u-button>
				<u-action-sheet :show="showVisitNatureDropdown" :actions="visitNatures"
					@close="showVisitNatureDropdown = false" @select="selectVisitNature"></u-action-sheet>
				<u-popup :show="showSubmitPopup" mode="bottom" @close="showSubmitPopup = false"
					customStyle="position: fixed; left: 100rpx; right: 100rpx; top: 50%; transform: translateY(-50%);">
					<view class="u-popup__content">
						<view style="margin-top: 25px;">
							<p style="color: #212121;">重要提示</p><br />
							<p style="color: #9A9A9A; margin-top: 20rpx;">确认提交预约申请吗?</p><br />
						</view>
						<view style="margin-top: 60rpx;">
							<a class="confirm" @click="confirmSubmit">确认</a>
							<a class="revocation" @click="cancelSubmit">取消</a>
						</view>
					</view>
				</u-popup>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formModel: {
					visitDate: '',
					visitUnit: '',
					visitNature: '', // 存储 visitNature 的 value
					visitNum: '',
					visitCar: '',
					contactName: '',
					contactPhone: ''
				},
				visitNatures: [{
						name: '学校',
						value: '1'
					},
					{
						name: '企事业单位',
						value: '2'
					},
					{
						name: '政府部门',
						value: '3'
					}
				],
				showVisitNatureDropdown: false,
				showSubmitPopup: false,
				selectedVisitNature: '' // 用于显示选择的单位性质名称
			};
		},
		onLoad(options) {
			// 读取参数
			const visitDate = options.visitDate;
			const timeSlot = options.timeSlot;
			this.formModel.visitDate = `${visitDate} ${timeSlot}`;

			// 处理单位性质值
			const visitNature = options.visitNature;
			if (visitNature) {
				const nature = this.visitNatures.find(n => n.value === visitNature);
				if (nature) {
					this.formModel.visitNature = nature.value; // 使用数字值
					this.selectedVisitNature = nature.name; // 显示名称
				}
			}
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			},
			showSubmitDialog() {
				this.showSubmitPopup = true;
			},

			// 格式化日期为 yyyy-MM-dd
			formatDate(date) {
				const d = new Date(date);
				const year = d.getFullYear();
				const month = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			confirmSubmit() {
				this.showSubmitPopup = false;

				// 格式化日期
				this.formModel.visitDate = this.formatDate(this.formModel.visitDate);
				// 发起 POST 请求
				uni.request({
					url: 'http://localhost:8080/cdtu-visit/add', // 后端接口地址
					method: 'POST',
					data: this.formModel,
					header: {
						'Content-Type': 'application/json' // 或其他适合你接口的 Content-Type
					},
					success: (response) => {
						if (response.statusCode === 200) {
							uni.$u.toast('提交成功');
							console.log('提交成功:', response.data);
						} else {
							uni.$u.toast('提交失败');
						}
					},
					fail: (error) => {
						uni.$u.toast('请求失败');
						console.error('请求失败:', error);
					}
				});
			},
			cancelSubmit() {
				this.showSubmitPopup = false;
				uni.$u.toast('取消成功');
			},
			selectVisitNature(e) {
				this.formModel.visitNature = e.value; // 设置为 value 值
				this.selectedVisitNature = e.name; // 更新显示的单位性质名称
				this.showVisitNatureDropdown = false;
			}
		}
	}
</script>

<style lang="scss">
	/* 自定义样式 */
	.u-popup__content {
		height: 300rpx;
		text-align: center;
		background-color: white;
		/* 设置背景颜色 */
		border-radius: 16rpx;
		/* 设置圆角 */
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
		/* 添加阴影效果 */
	}

	.confirm {
		display: inline-block;
		color: #576B95;
		width: 48%;
		height: 32px;
		border: 1rpx solid #F4F4F4;
		margin-bottom: 0rpx;
	}

	.revocation {
		display: inline-block;
		color: #5C5C5C;
		width: 48%;
		height: 32px;
		border: 1rpx solid #F4F4F4;
		margin-bottom: 0rpx;
	}
</style>