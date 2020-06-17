$(function() {
	let app = new Vue({
		el: "#app",
		data: {
			icons: [],
			weathers: [],
		},
		methods: {
			initIcons: function() {
				this.icons['晴'] = '100n';
				this.icons['多云'] = '101';
				this.icons['少云'] = '102';
				this.icons['晴间多云'] = '103n';
				this.icons['阴'] = '104n';
				this.icons['有风'] = '200';
				this.icons['平静'] = '201';
				this.icons['微风'] = '202';
				this.icons['和风'] = '203';
				this.icons['清风'] = '204';
				this.icons['强风/劲风'] = '205';
				this.icons['疾风'] = '206';
				this.icons['大风'] = '207';
				this.icons['烈风'] = '208';
				this.icons['风暴'] = '209';
				this.icons['狂爆风'] = '210';
				this.icons['飓风'] = '211';
				this.icons['龙卷风'] = '212';
				this.icons['热带风暴'] = '213';
				this.icons['阵雨'] = '300n';
				this.icons['强阵雨'] = '301n';
				this.icons['雷阵雨'] = '302';
				this.icons['强雷阵雨'] = '303';
				this.icons['雷阵雨伴有冰雹'] = '304';
				this.icons['小雨'] = '305';
				this.icons['中雨'] = '306';
				this.icons['大雨'] = '307';
				this.icons['极端降雨'] = '308';
				this.icons['毛毛雨/细雨'] = '309';
				this.icons['暴雨'] = '310';
				this.icons['大暴雨'] = '311';
				this.icons['特大暴雨'] = '312';
				this.icons['冻雨'] = '313';
				this.icons['小到中雨'] = '314';
				this.icons['中到大雨'] = '315';
				this.icons['大到暴雨'] = '316';
				this.icons['暴雨到大暴雨'] = '317';
				this.icons['大暴雨到特大暴雨'] = '318';
				this.icons['雨'] = '399';
				this.icons['小雪'] = '400';
				this.icons['中雪'] = '401';
				this.icons['大雪'] = '402';
				this.icons['暴雪'] = '403';
				this.icons['雨夹雪'] = '404';
				this.icons['雨雪天气'] = '405';
				this.icons['阵雨夹雪'] = '406n';
				this.icons['阵雪'] = '407n';
				this.icons['小到中雪'] = '408';
				this.icons['中到大雪'] = '409';
				this.icons['大到暴雪'] = '410';
				this.icons['雪'] = '499';
				this.icons['薄雾'] = '500';
				this.icons['雾'] = '501';
				this.icons['霾'] = '502';
				this.icons['扬沙'] = '503';
				this.icons['浮尘'] = '504';
				this.icons['沙尘暴'] = '507';
				this.icons['强沙尘暴'] = '508';
				this.icons['浓雾'] = '509';
				this.icons['强浓雾'] = '510';
				this.icons['中度霾'] = '511';
				this.icons['重度霾'] = '512';
				this.icons['严重霾'] = '513';
				this.icons['大雾'] = '514';
				this.icons['特强浓雾'] = '515';
				this.icons['热'] = '900';
				this.icons['冷'] = '901';
				this.icons['未知'] = '999';
			},
			loadWeathers: function() {
				let text = localStorage.getItem("my-city");
				let cities = text ? JSON.parse(text) : [];
				if (cities.length == 0) {
					this.locateCity();
				} else {
					cities.forEach(function(item, index) {
						let weather = {
							code: item[0],
							name: item[1],
							temp: "",
							windGrade: "",
							windDir: "",
							wet: "",
							updateTime: "",
							air: {},
							sun: {},
							cold: {},
							coat: {},
							car: {},
							days: [],
						};
						app.weathers.push(weather);
						setTimeout(app.loadWeather, index * 1000, item);
					});
				}
			},
			loadWeather: function(city) {
				// let weather = {};
				// weather.code = city[0];
				// weather.name = city[1];
				// let weather = app.weathers.find(function(x) {
				// 	return x.code == city[0];
				// });

				let weather = null;
				app.weathers.forEach(function(x) {
					if (x.code == city[0]) {
						weather = x;
					}
				});
				let url = "http://weather.speedle.top/api/weather/getweather/" + weather.code;
				$.get(url, function(data, status) {
					// app.weathers.push(weather);

					let doc = $($.parseXML(data));
					weather.temp = doc.find("resp > wendu").text();
					weather.windGrade = doc.find("resp > fengli").text();
					weather.windDir = doc.find("resp > fengxiang").text();
					weather.wet = doc.find("resp > shidu").text();
					weather.updateTime = doc.find("resp > updatetime").text() + " 更新";

					doc.find("zhishu").each(function(index, item) {
						let name = $(item).find("name").text();
						switch (name) {
							case "污染指数":
								weather.air = {
									title: $(item).find("detail").text(),
									text: $(item).find("value").text()
								};
								break;
							case "感冒指数":
								weather.cold = {
									title: $(item).find("detail").text(),
									text: $(item).find("value").text()
								};
								break;
							case "紫外线强度":
								weather.sun = {
									title: $(item).find("detail").text(),
									text: $(item).find("value").text()
								};
								break;
							case "晾晒指数":
								break;
							case "护肤指数":
								break;
							case "穿衣指数":
								weather.coat = {
									title: $(item).find("detail").text(),
									text: $(item).find("value").text()
								};
								break;
							case "户外指数":
								break;
							case "洗车指数":
								weather.car = {
									title: $(item).find("detail").text(),
									text: $(item).find("value").text()
								};
								break;
						}
					});

					weather.days = [];
					let matches = null;
					doc.find("forecast > weather").each(function(index, item) {
						let day = {};
						weather.days.push(day);

						matches = /(星期.)/.exec($(item).find("date").text());
						day.date = matches[1];

						matches = /(\d+℃)/.exec($(item).find("high").text());
						day.high = matches[1];

						matches = /(\d+℃)/.exec($(item).find("low").text());
						day.low = matches[1];

						day.wind = $(item).find("day fengxiang").text() + "<br/>" + $(item).find("day fengli").text();

						day.icon1 = "img/icon/" + app.trimEnd(app.icons[$(item).find("day type").text()], "n") + ".png";
						day.icon2 = "img/icon/" + app.icons[$(item).find("night type").text()] + ".png";

						day.title = $(item).find("date").text() + "\n" +
							$(item).find("low").text() + "\n" +
							$(item).find("high").text() + "\n" +
							"白天 " + $(item).find("day>type").text() + " " + $(item).find("day>fengxiang").text() + " " + $(item).find(
								"day>fengli").text() + "\n" +
							"晚上 " + $(item).find("night>type").text() + " " + $(item).find("night>fengxiang").text() + " " + $(item)
							.find("night>fengli").text();
					});
				});
			},
			locateCity: function() {
				$.ajax({
					url: "http://pv.sohu.com/cityjson?ie=utf-8",
					type: "GET",
					dataType: "jsonp",
					complete: function() {
						let url = "http://weather.speedle.top/api/weather/getarea/" + returnCitySN.cid;
						$.get(url, function(data, status) {
							if (data) {
								let weather = {
									code: data.WeatherCode,
									name: data.Name,
									temp: "",
									windGrade: "",
									windDir: "",
									wet: "",
									updateTime: "",
									air: {},
									sun: {},
									cold: {},
									coat: {},
									car: {},
									days: [],
								};
								app.weathers.push(weather);
								app.loadWeather([data.WeatherCode, data.Name]);
							}
						});
					}
				});
			},
			trimEnd: function(text, c) {
				if (c == null || c == "") {
					var str = text;
					var rg = /s/;
					var i = str.length;
					while (rg.test(str.charAt(--i)));
					return str.slice(0, i + 1);
				} else {
					var str = text;
					var rg = new RegExp(c);
					var i = str.length;
					while (rg.test(str.charAt(--i)));
					return str.slice(0, i + 1);
				}
			}
		}
	});
	app.initIcons();
	app.loadWeathers();
});
