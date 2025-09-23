<template>
  <view class="u-page">
    <view class="u-demo-block">
      <view class="u-demo-block__content">
        <u-list>
          <u-list-item v-for="(item, index) in applicationRecords" :key="index" class="list-item"
            @click="showDetail(item)">
            <view class="list-item-content">
              <view class="visit-time">{{ item.visitTime }}</view>
              <view class="details">{{ item.details }}</view>
              <view class="status-buttons">
                <u-button v-if="item.status === 0" type="primary" class="status-btn status-pending"
                  @click="showDetail(item)">
                  审核中
                </u-button>
                <u-button v-if="item.status === 1" type="success" class="status-btn status-approved"
                  @click="showDetail(item)">
                  通过
                </u-button>
                <u-button v-if="item.status === 2" type="error" class="status-btn status-rejected"
                  @click="showDetail(item)">
                  未通过
                </u-button>
              </view>
            </view>
          </u-list-item>
        </u-list>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      applicationRecords: [
        { visitTime: '2024-08-01', details: '详细内容 1', status: 0 },
        { visitTime: '2024-08-02', details: '详细内容 2', status: 1 },
        { visitTime: '2024-08-03', details: '详细内容 3', status: 2 }
      ],
      showDetailPopup: false,
      selectedItem: {}
    };
  },
  methods: {
    showDetail(item) {
      this.selectedItem = item;
      this.showDetailPopup = true;
    }
  }
};
</script>

<style scoped>
/* 自定义样式 */
.u-page {
  padding: 20rpx;
}

.u-demo-block {
  margin-bottom: 20rpx;
}

.u-demo-block__content {
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.list-item {
  border-bottom: 1rpx solid #eee;
}

.list-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx;
}

.visit-time {
  font-size: 16rpx;
  font-weight: bold;
}

.details {
  font-size: 14rpx;
  color: #9a9a9a;
  /* 浅色字体 */
}

.status-buttons {
  display: flex;
  gap: 5rpx;
}

.status-btn {
  font-size: 12rpx;
}
</style>
