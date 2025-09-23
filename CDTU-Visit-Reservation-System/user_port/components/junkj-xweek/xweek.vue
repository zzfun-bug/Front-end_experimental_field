<!--
使用示例
<xweek v-on:back="changeBack"></xweek>
methods: {
	changeBack:function(d){
		console.log(d);
	}
}
-->
<template>
	<view class="xweek_box">
		<view class="xweek_ym">
			<text @tap="prevYear"><text class="i prev_i"></text></text>
			<text class="ym_text">{{y}}年</text>
			<text @tap="nextYear"><text class="i next_i"></text></text>

			<text @tap="prevMonth"><text class="i prev_i"></text></text>
			<text class="ym_text">{{m+1}}月</text>
			<text @tap="nextMonth"><text class="i next_i"></text></text>

			<text @tap="prevWeek"><text class="i prev_i"></text></text>
			<text class="ym_text">周</text>
			<text @tap="nextWeek()"><text class="i next_i"></text></text>
		</view>
		<view class="xweek_title">
			<text>一</text><text>二</text><text>三</text><text>四</text><text>五</text><text>六</text><text>日</text>
		</view>
		<view class="xweek_day">
			<view class="day_body" :class="dayClass">
				<view class="day" v-for="(item,index) in days" :key="index">
					<text :class="item.sel?'sel':''" @tap="change(item)">{{item.d}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				y: '',
				m: '',
				d: '',
				thsDay: '',
				date: '',
				days: [],
				move: true,
				dayClass: ''
			}
		},
		created() {
			this.init(new Date());
		},
		methods: {
			init(date) {
				this.thsDay = date.getDate()
				this.date = this.format(date)
				this.setDays(date)
			},
			setDays(date) {
				let y = this.y = date.getFullYear(),
					m = this.m = date.getMonth(),
					d = this.d = date.getDate(),
					prevDate = new Date(y, m, d - 7),
					start = this.getWeek1(prevDate);
				this.days = [];
				for (let i = 0; i < 21; ++i) {
					let arr = start.split("-");
					this.days[i] = {
						y: arr[0],
						m: arr[1],
						d: arr[2],
						sel: arr[2] == this.thsDay
					};
					start = this.addDate(start, 1);
				}
			},
			change(d) {
				let date = new Date(d.y, d.m - 1, d.d)
				this.init(date);
				this.$emit("back", this.date)
			},
			format(date) {
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				let d = date.getDate();
				return y + '-' + this.fill(m) + '-' + this.fill(d);
			},
			fill(a) {
				return 10 > a ? '0' + (0 | a) : a
			},
			getWeek(y, m, d) {
				return new Date(y, m, d).getDay();
			},
			getWeek1(date) {
				let nowTime = date.getTime();
				let day = date.getDay() == 0 ? 7 : date.getDay();
				let oneDayLong = 24 * 60 * 60 * 1000;
				let time = nowTime - (day - 1) * oneDayLong;
				let week1 = new Date(time);
				return this.format(week1);
			},
			addDate(date, days) {
				if (days == undefined || days == '') {
					days = 1;
				}
				var date = new Date(date);
				date.setDate(date.getDate() + days);
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				let d = date.getDate();
				return y + '-' + this.fill(m) + '-' + this.fill(d);
			},
			moveDay(y, m, d) {
				let date = new Date(y, m, d || this.d)
				this.setDays(date);
			},
			prevYear() {
				this.moveDay(this.y - 1, this.m)
			},
			nextYear() {
				this.moveDay(this.y + 1, this.m)
			},
			prevMonth() {
				this.moveDay(this.y, this.m - 1)
			},
			nextMonth() {
				this.moveDay(this.y, this.m + 1)
			},
			prevWeek() {
				if (this.move) {
					this.move = false;
					this.dayClass = "to_left";
					let ths = this;
					setTimeout(function() {
						ths.dayClass = "";
						ths.moveDay(ths.y, ths.m, ths.d - 7)
						ths.move = true;
					}, 1000)
				}
			},
			nextWeek() {
				if (this.move) {
					this.move = false;
					this.dayClass = "to_right";
					let ths = this;
					setTimeout(function() {
						ths.dayClass = "";
						ths.moveDay(ths.y, ths.m, ths.d + 7)
						ths.move = true;
					}, 1000)
				}
			}
		}
	}
</script>

<style>
	/* 周日期样式*/
	.xweek_box {
		width: 100%;
		background: #FFFFFF;
		color: #888;
		font-size: 12px;
		border-top: 2px solid #ffc122;
		border-bottom: 1px solid #ffc122;
	}

	.xweek_ym {
		font-size: 14px;
		line-height: 36px;
		border-bottom: 1px solid #dadada;
		text-align: center;
	}

	.xweek_ym .ym_text {
		margin: 0 30upx;
	}

	.xweek_ym .i {
		display: inline-block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: dashed;
		border-width: 8px;
		margin-top: -3px;
		vertical-align: middle;
	}

	.xweek_ym .next_i {
		margin-right: 5px;
		border-left-color: #ffc122
	}

	.xweek_ym .prev_i {
		margin-left: 5px;
		border-right-color: #ffc122
	}

	.xweek_title {
		height: 30px;
		line-height: 30px;
	}

	.xweek_title text {
		display: inline-block;
		width: 14.28%;
		text-align: center;
	}

	.xweek_day {
		overflow: hidden;
		position: relative;
		height: 40px;
	}

	.xweek_day .day_body {
		position: absolute;
		width: 300%;
		left: -100%;
	}

	.xweek_day .day {
		text-align: center;
		display: inline-block;
		width: 4.7619%;
		height: 28px;
		line-height: 28px;
		color: #333333;
		font-size: 16px;
		font-weight: 600;
	}

	.xweek_day .sel {
		display: inline-block;
		width: 28px;
		background: #ffc122;
		border-radius: 50%;
		color: #fff;
	}

	.to_left {
		animation: toLeft 1s ease-in infinite;
	}

	.to_right {
		animation: toRight 1s ease-in infinite;
	}

	@-webkit-keyframes toLeft {
		from {
			left: -100%;
		}

		to {
			left: 0%;
		}
	}

	@-webkit-keyframes toRight {
		from {
			left: -100%;
		}

		to {
			left: -200%;
		}
	}
</style>
