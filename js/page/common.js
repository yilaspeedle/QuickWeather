$(function() {
	checkMenu();
	initTimes();
	initSwiper();
});

function checkMenu() {
	let needle = location.pathname.toLowerCase();
	let match = false;
	$("#menuMain>li").each(function(index, item) {
		if (needle.indexOf($(item).find("a").attr("href").toLowerCase()) != -1) {
			$(item).addClass("selected");
			match = true;
		}
	});
	if (!match) {
		$("#menuMain>li:eq(0)").addClass("selected");
	}
}

function initTimes() {
	let now = new Date();
	let weeks = ["日", "一", "二", "三", "四", "五", "六"];
	$("#timeDay").text(now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now
		.getDate() + "日");
	$("#timeWeek").text(weeks[now.getDay()]);
	getChinaDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function getChinaDay(year, month, day) {
	let url = "http://weather.speedle.top/home/day?year=" + year + "&month=" + month + "&day=" + day;
	//let url = "http://localhost:30233/home/day?year=" + year + "&month=" + month + "&day=" + day;
	$.get(url, function(result) {
		if (result.Code == 0) {
			$("#timeDay2").text(result.Data.Lunar);
			$("#timeAnimal").text(result.Data.Animal);
			$("#timeStar").text(result.Data.Constellation);
		} else {
			alert(result.Message);
		}
	});
}

function initSwiper() {
	var bg = new Swiper('.swiper-container', {
		loop: true,
		autoplay: {
			delay: 5000
		},
		effect: "fade",
	})
}

//去除字符串尾部空格或指定字符  
String.prototype.trimEnd = function(c) {
	if (c == null || c == "") {
		var str = this;
		var rg = /s/;
		var i = str.length;
		while (rg.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	} else {
		var str = this;
		var rg = new RegExp(c);
		var i = str.length;
		while (rg.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}
}
