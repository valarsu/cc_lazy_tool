$(function () {

	// 生成tag，并可点击按钮注入

	$('#tag_pre').text('v' + getTime() + '_pre')
	$('#tag_gray').text('v' + getTime() + '_gray')
	$('#tag_normal').text('v' + getTime())

	$('.send-msg').on('click', function () {
		var type = $(this).attr('id')
		chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
			chrome.tabs.sendMessage(tab[0].id, {
				action: 'send_' + type,
				keyword: $('#tag_' + type).text()
			})
		})
	})

	$('#reload').on('click', function () {
		location.reload()
	})

	// 切换灰度，并刷新

	if (!chrome.cookies) {
	  chrome.cookies = chrome.experimental.cookies;
	}
	getGrayStatus()

  $('#toggleGray').on('click', function () {
  	var flag = $(this).prop('checked').toString()
		var desc = $(this).prop('checked')
	  matchCookies(function (type) {
	  	chrome.cookies.set({
			  url: `http://${type}.management.vipkid.com.cn`,
			  name: `${type}GrayFlag`,
			  value: flag
			}, function (val) {
				labelStatus(desc)
  			chrome.tabs.reload()
			})
	  }, function () {
    	alert('请切换到CC或TMk的管理页面！')
	  })
	})
})

function getRandom() {
	return Math.floor(Math.random() * 100)
}

// 获取当前时间
function getTime() {
	var year = new Date().getFullYear().toString()
	var month = (new Date().getMonth() + 1).toString()
	var day = new Date().getDate().toString()
	var hour = new Date().getHours().toString()
	var minute = new Date().getMinutes().toString()
	return year + prev0(month) + prev0(day) +  prev0(hour) + prev0(minute) + prev0(getRandom())
}
// 单位数前面加0
function prev0(val) {
	return val < 10 ? ('0' + val) : val
}

// 同步ccGrayFlag状态到开关
function getGrayStatus() {
  matchCookies(function (type) {
  	$('#toggleGray').prop('disabled', false)
  	chrome.cookies.get({
		  url: `http://${type}.management.vipkid.com.cn`,
		  name: `${type}GrayFlag`
		}, function (val) {
			var isGray = val ? (val.value === 'true' ? true : false) : false
		  $('#toggleGray').prop('checked', isGray)
		  labelStatus(isGray)
		})
  }, function () {
  	$('#toggleGray').prop('disabled', true)
  })
}
function labelStatus(flag) {
	$('.choose-label').text(flag ? 'ON' : 'OFF')
	if (flag) {
		$('.choose-label').removeClass('text-right').addClass('text-left')
	} else {
		$('.choose-label').removeClass('text-left').addClass('text-right')
	}
}
function matchCookies (cb, elcb) {
	chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
		var tabUrl = tab[0].url
		var start = tabUrl.indexOf('//') + 2
		var end = tabUrl.indexOf('.management')
		var systemVal = tabUrl.slice(start, end)
	  if(tab[0].url && tab[0].url.indexOf(`${systemVal}.management.vipkid.com.cn`) > 0) {
			cb && cb(systemVal)
	  } else {
	  	elcb && elcb()
	  }
  })

}
