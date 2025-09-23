//包装uni的提示信息框

/**
 * 包装uni.showToast()
 * @param title
 * @param icon
 */
export function showToast(title,icon){
	// 参考官方文档:https://uniapp.dcloud.net.cn/api/ui/prompt.html#showtoast
    uni.showToast({
        title:title,
		icon:icon
    })
}

/**
 * 展示成功信息(带图标)
 * @param title 标题
 */
export function showSuccess(title){
    showToast(title,'success')
}

/**
 * 展示错误信息(带图标)
 * @param e
 * @param config(可选)
 */
export function showError(title) {
    showToast(title,'error')
}

/**
 * 弹出确认对话框的封装
 * @param title 对话框标题
 * @param content 对话框内容
 * @return 点击确认框确定按钮返回true，点击确认框取消按钮返回false 
 */
export function showConfirmModal(title, content, showCancel=true) {
    return new Promise((resolve, reject) => {
		// 参考官方文档：https://uniapp.dcloud.net.cn/api/ui/prompt.html#showmodal
		uni.showModal({
			title: title,
			content: content,
			showCancel: showCancel,
			success: function (res) {
				if (res.confirm) {
					return resolve(true)
				} else if (res.cancel) {
					return resolve(false)
				}
			}
		});
    })
}