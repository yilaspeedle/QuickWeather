$(function() {
	let app = new Vue({
		el: "#app",
		data: {
			areas: null,
			province: null,
			city: null,
			myCities: null,
			row: null,
		},
		methods: {
			loadProvinces: function() {
				$.get("http://weather.speedle.top/api/weather/getareas",
					function(data) {
						app.areas = data;
						if (data.length > 0) {
							app.province = data[0].Code;
							app.onChangeProvince();
						}
					});
			},
			onChangeProvince: function() {
				// this.city = this.areas.find(item => {
				// 	return item.Level == 3 && item.ParentCode == this.province;
				// });
				let that = this;
				this.areas.forEach(function(item) {
					if (item.Level == 3 && item.ParentCode == that.province) {
						that.city = item;
					}
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
							if (!data) {
								alert("定位失败");
							} else {
								app.addCity(null, [data.WeatherCode, data.Name]);
							}
						});
					}
				});
			},
			getMyCities: function() {
				let text = localStorage.getItem("my-city");
				this.myCities = text ? JSON.parse(text) : [];
			},
			saveMyCities: function() {
				localStorage.setItem("my-city", JSON.stringify(this.myCities));
			},
			existCity: function(id) {
				// let match = this.myCities.find(item => {
				// 	return item[0] == id;
				// });

				let match = null;
				this.myCities.forEach(function(item) {
					if (item[0] == id) {
						match = item
					}
				});
				return match ? true : false;
			},
			addCity: function(event, args) {
				let id, name;
				if (args) {
					id = args[0];
					name = args[1];
				} else {
					id = this.city.WeatherCode;
					name = this.city.Name;
				}
				if (!this.existCity(id)) {
					this.myCities.push([id, name]);
					this.saveMyCities();
				}
			},
			removeCity: function(item) {
				// let [id, name] = item;
				let id = item[0];
				let name = item[1];
				if (!confirm("确认要删除【" + name + "】吗？")) return;
				for (let i = 0; i < this.myCities.length; i++) {
					if (this.myCities[i][0] == id) {
						this.myCities.splice(i, 1);
						break;
					}
				}
				this.saveMyCities();
			},
			moveUp: function(index) {
				let temp = this.myCities[index];
				app.$set(this.myCities, index, this.myCities[index - 1]);
				app.$set(this.myCities, index - 1, temp);
				this.row = index - 1;
				this.saveMyCities();
			},
			moveDown: function(index) {
				let temp = this.myCities[index];
				app.$set(this.myCities, index, this.myCities[index + 1]);
				app.$set(this.myCities, index + 1, temp);
				this.row = index + 1;
				this.saveMyCities();
			}
		}
	});
	app.loadProvinces();
	app.getMyCities();
});
