<template>
	<view>
		<u-calendar :show="value" :min-date="minDate2" :default-date="defaultDate2" :closeOnClickOverlay="true" :month-num="monthNum" :color="color" @confirm="confirm" @close="onClose"></u-calendar>
	</view>
</template>

<script>
	
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			},
			minDate: {
				type: String,
				default: ""
			},
			defaultDate: {
				type: String,
				default: ""
			},
			monthNum: {
				type: Number,
				default: 6
			},
			color: {
				type: String,
				default: "orange"
			}
		},
		data() {
			return {
				minDate2: "",
				defaultDate2: "",
			}
		},
		watch: {
			value(nv) {
				if(nv && this.defaultDate) {
					this.defaultDate2 = this.defaultDate;
				}
			}
		},
		mounted() {
			if(this.minDate==="") {
				this.minDate2 = this.$dayjs(new Date()).subtract(3, 'month').format('YYYY-MM-DD');
			} else {
				this.minDate2 = this.minDate;
			}
			if(this.defaultDate==="") {
				this.defaultDate2 = this.$commonJs.getToday();
			} else {
				this.defaultDate2 = this.defaultDate;
			}
		},
		methods: {
			confirm(date) {
				this.$emit("input",false);
				this.$emit("date",date[0]);
			},
			onClose() {
				this.$emit("input",false);
			},
		}
	}
</script>

<style>

</style>
