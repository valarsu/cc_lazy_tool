$(function () {
	chrome.runtime.onMessage.addListener(function (req, sender, resp) {
		try {
			$('#tag_name').val(req.keyword)
			$('.btn-create').removeClass('disabled').prop('disabled', false)
		} catch (e) {
			alert('当前页面不支持！')
			console.log(e)
		}
	})
})