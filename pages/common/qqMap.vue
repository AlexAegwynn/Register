<template>
  <view>
    <view id="qqmap" :t="test" :change:t="render.renderCall" :style="{width,height}"></view>
  </view>
</template>
<script>
  export default {
    props: {
      width: {
        type: String,
        default: "100%"
      },
      height: {
        type: String,
        default: "300px"
      },
    },
    data() {
      return {
        test: null
      }
    },
    methods: {
      mapCall(e) {
        console.log('call', e);
        this.$emit('ready');
      },
      testCall() {
        console.log('mapCall', this.render)
      }
    }
  }
</script>
<script module="render" lang="renderjs">
  export default {
    props: {
      //初始化中心坐标点 { lat,lng }
      initCenterLocation: {
        type: Object,
        default: undefined
      },
      initZoom: {
        type: Number,
        default: 16
      },
      countCenter: {
        type: Boolean,
        default: false
      },
      markers: {
        type: Array,
        default: () => []
      },
      polygons: {
        type: Array,
        default: () => []
      },
      areaNames: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        connum: "comtest",
        map: null,
        marker: null,
        overlay: null,
        label: null,
        src: 'data:image/png;base64,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',
      };
    },
    mounted() {
      this.$nextTick(() => {
        if (typeof window.TMap === 'function') {
          this.init()
        } else {
          // 动态引入较大类库避免影响页面展示
          const script = document.createElement('script')
          script.src =
            'https://map.qq.com/api/gljs?v=1.exp&key=YE7BZ-M2JWJ-MAYFO-FW45Q-KY563-3HFJ7&libraries=tools,geometry,service'
          script.onload = this.init.bind(this)
          document.head.appendChild(script);
        }
      })
    },
    methods: {
      renderCall(nv, ov) {
        console.log('render', nv, ov)
		// this.map.setZoom(nv.zoom||16);
		if(!nv) {
			return;
		}
		if(nv.polygons&&nv.polygons.length) {
			var polGeometries = [];
			nv.polygons.forEach((e,index) => {
				var paths = [];
				e.points.forEach(n => {
					paths.push(
						new TMap.LatLng(n.Lat,n.Lng)
					)
				})
				this.overlay.add({
					id: "a" + index,
					styleId: "styles",
					paths
				})
			})
			if(nv.areaNames&&nv.areaNames.length) {
				var labels = [];
				nv.polygons.forEach((m,index2) => {
					var ac = m.points.map(x => {
						return new TMap.LatLng(x.Lat, x.Lng)
					});
					var c = TMap.geometry.computeCentroid(ac);
					if(index2==0) {
						this.map.setCenter(new TMap.LatLng(c.lat, c.lng));
					}
					this.label.add({
						id: 'l' + index2,
						styleId: 'label',
						position: new TMap.LatLng(c.lat, c.lng),
						content: nv.areaNames[index2],
					})
				})
			}
		}
		//标记车辆
		if(nv.markers&&nv.markers.length) {
			if(ov&&ov.markers&&ov.markers.length) {
				var ids = ov.markers.map(x => {
					return x.CarId;
				})
				this.marker.remove(ids);
			}
			this.$nextTick(() => {
				nv.markers.forEach((e,index) => {
					this.marker.add({
						id: e.CarId,
						styleId: "marker",
						position: new TMap.LatLng(e.Lat,e.Lng),
					})
				})
				this.map.setCenter(new TMap.LatLng(nv.markers[0].Lat, nv.markers[0].Lng));
			})
		}
	  },
      init() {
        console.log('init', window.TMap);
        // 向父组件传参
        this.$ownerInstance.callMethod('mapCall');
        // UniViewJSBridge.publishHandler('onWxsInvokeCallMethod', {
        //   cid: this._$id,
        //   method: 'mapCall',
        //   args: {
        //     type: 1,
        //     name: '2'
        //   }
        // })
        let center;
        if (this.initCenterLocation) {
          center = new window.TMap.LatLng(
            this.initCenterLocation.lat,
            this.initCenterLocation.lng
          );
        } else if (this.countCenter) {
          var ps = this.polygons[0].points.map(x => {
            return new TMap.LatLng(x.Lat, x.Lng)
          })
          var c = TMap.geometry.computeCentroid(ps);
          center = new TMap.LatLng(c.lat, c.lng);
        } else {
          // center = new window.TMap.LatLng(39.916527, 116.397128);
          center = new window.TMap.LatLng(23.3650083, 116.7013803);
        }

        let map = new window.TMap.Map(document.getElementById('qqmap'), {
          // 地图的中心地理坐标。
          center,
          zoom: this.initZoom
        });
        var overlay = new TMap.MultiPolygon({
          map,
          styles: {
            highlight: new TMap.PolygonStyle({
              color: "rgba(255, 255, 0, 0.6)",
            }),
          },
          geometries: [],
        });

        var label = new TMap.MultiLabel({
          id: 'label-layer',
          map,
          styles: {
            label: new TMap.LabelStyle({
              color: '#ff0000', // 颜色属性
              size: 18, // 文字大小属性
              offset: {
                x: 0,
                y: 0
              }, // 文字偏移属性单位为像素
              angle: 0, // 文字旋转属性
              alignment: 'center', // 文字水平对齐属性
              verticalAlignment: 'middle', // 文字垂直对齐属性
            }),
          },
          geometries: [],
        })

        var marker = new TMap.MultiMarker({
          id: "marker-layer",
          map,
          styles: {
            // 点标记样式
            marker: new TMap.MarkerStyle({
              width: 48, // 样式宽
              height: 52, // 样式高
              src: this.src,
              faceTo: 'map',
              anchor: {
                x: 24,
                y: 26
              }, // 描点位置
            }),
          },
          geometries: [],
        });

        this.map = map;
        this.marker = marker;
        this.label = label;
        this.overlay = overlay;

        // 去除logo及水印，开发文档中也有去除LOGO的方法，但不能去除左下角信息
        var a = document.querySelector('canvas+div:last-child');
        var child = a.querySelector('div:last-child');
        var logo = child.querySelector('div:first-of-type');
        logo.style.display = 'none';
      },
      goPosition(lat, lng) {
        this.map.setCenter(new TMap.LatLng(lat, lng));
      },
      setZoom(num) {
        this.map.setZoom(num);
      },
    },
    //设置坐标位置
    setLocation(location) {
      let latLng = new window.TMap.LatLng(location.lat, location.lng);
      this.map.setCenter(latLng);
      this.map.setZoom(13);
      this.marker.setPosition(latLng);
    },
  };
</script>
<style lang="scss">
  /deep/ #qqmap>div div div {
    // display: none !important;
    visibility: hidden;
  }
</style>
