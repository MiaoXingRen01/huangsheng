<template>
	<div :id="$route.name">
		<a-card style="height: 88vh; ">
			<a-row :gutter="16" justify="center">
				<a-col :span="7">
				</a-col>
				<a-col :span="10">
					<div
						style="border: 1px dashed #aaa;  border-radius: 5px; margin-top: 100px; position: relative; height: 374px; ">


						<div style=" margin-top: 30px;  margin-bottom: 10px; text-align: center;  ">

							<img style="width: 50px; margin-right: 14px;display: inline-block; "
								v-if="!!userInfo.id && userInfo.isShowLogo"
								:src="require(`@/assets/logo/${userInfo.id}/logo.png`)" />
							<!-- <span style="font-size: 50px; font-weight:600;  letter-spacing: 8px; color: #444; ">{{
		printInfo.v0 }}</span> -->
							<img style="width: 250px;display: inline-block; "
								v-if="!!userInfo.id && userInfo.isShowTitle"
								:src="require(`@/assets/logo/${userInfo.id}/title.png`)">
						</div>
						<a-row style="height: 100%;">

							<a-col :span="16" style="height: 100%; padding-left: 40px; ">
								<div style="position: relative; height: 100%; ">

									<div style=" margin-top: 36px; padding-right:25px; ">
										<div
											style="display: grid;  grid-template-columns: 1fr 4fr; margin-top: 10px; align-items: flex-end;  ">
											<span
												style="font-size: 17px; letter-spacing: 5px;font-weight: 600; ">客户：</span>
											<span>
												<a-auto-complete v-model:value="printInfo.v1" :options="customList"
													style="width: 100%; height: 100%" placeholder=""
													:filter-option="filterOption" allowClear />
											</span>
										</div>
										<div
											style="display: grid;  grid-template-columns: 1fr 4fr; margin-top: 26px;  align-items: flex-end; ">
											<span
												style="font-size: 17px; letter-spacing: 5px; font-weight: 600;">件数：</span>
											<span> <a-auto-complete v-model:value="printInfo.v2" :options="countList"
													style="width: 100%; height: 100%" placeholder=""
													:filter-option="filterOption" allowClear /></span>
										</div>
									</div>
									<div style="position: absolute; bottom: 164px; font-size: 15px;">
										<div v-if="!!userInfo.address">
											<span>
												<span>地址：</span>
												<span class="contact">{{ userInfo.address }}</span>
											</span>
										</div>
										<div style="margin-top: 5px;" v-if="!!userInfo.phone1">
											<span>手机：</span>
											<span class="contact">
												{{ userInfo.phone1 }}
											</span>
										</div>
										<div style="margin-top: 5px;" v-if="!!userInfo.phone2">
											<span>
												<span>电话：</span>
												<span class="contact">{{ userInfo.phone2 }}</span>
											</span>
										</div>
									</div>
								</div>
							</a-col>
							<a-col :span="8">
								<div style="position: relative;">
									<div v-if="userInfo.isShowQrcode"
										style=" display: flex; align-items: center; flex-flow: column;  margin-top: 24px; margin-right: 24px; ">
										<a-image style="width: 154px; " v-if="!!userInfo.id"
											:src="require(`@/assets/qrcode/${userInfo.id}.png`)"></a-image>
										<div style="font-size: 12px;">扫一扫查看公司产品详情</div>
									</div>
									<img style="left: -5px; width: 90%;  position: absolute; bottom: -44px;"
										v-if="!!userInfo.id && userInfo.isShowMsg"
										:src="require(`@/assets/logo/${userInfo.id}/msg.png`)">
									<!-- <div
										style="left: -15px; font-style: italic; font-size: 22px; text-align: center; color: #666; position: absolute; bottom: -54px; text-shadow: 5px 5px 5px #aaa; ">
										风里雨里 · 皇盛等你
									</div> -->
								</div>
							</a-col>

						</a-row>
					</div>
					<div style="text-align: center; margin-top: 24px;">
						<a-button style="width: 100%; padding: 10px 0; font-size: 16px; height: 44px " @click="print">
							打印
						</a-button>
					</div>
				</a-col>

				<a-col :span="7">
				</a-col>
			</a-row>
		</a-card>
	</div>
</template>

<script>
import { chineseToPinYin, firstPinyin } from "@/config/pinyin";
import Ellipsis from '@/components/ellipsis/index'
import app from "@/app.js";
import utils from "@/config/utils.js";
import statusUtil from "@/config/statusUtil.js";
import { DEFAULT, URLS } from "@/config/config.js";
import menuIcons from "@/components/remixicon/all-icon-list.json";
import { accountJson } from "@/config/state.js";
import dayjs from "dayjs";

export default {
	components: {
		Ellipsis,
	},
	data() {
		return {
			userInfo: {
			},
			accountJson,
			printInfo: {},
			customList: [],
			countList: [],
			date: dayjs(),
			no: null,

		};
	},
	async mounted() {
		console.log('mounted');
		this.userInfo = accountJson[app.getToken()];
		// this.productList = this.userInfo.productList.map(item => { return { value: item.name } });
		// this.normsList = this.userInfo.normsList.map(item => { return { value: item.name } });

		this.printInfo.v0 = app.userInfo.get().name;
		this.no = dayjs().valueOf();

		const printUserListStr = localStorage.getItem(`print_custom_${this.userInfo.id}`);
		if (!!printUserListStr) {
			this.customList = printUserListStr.split(',').map(item => { return { value: item } });
		}
		const countListStr = localStorage.getItem(`print_count_${this.userInfo.id}`);
		if (!!countListStr) {
			this.countList = countListStr.split(',').map(item => { return { value: item } });
		}

	},
	methods: {
		filterOption(input, option) {
			return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
				|| chineseToPinYin(option.value).toUpperCase().indexOf(input.toUpperCase()) >= 0
				|| firstPinyin(option.value).toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		print() {
			{
				this.customList.push({ value: this.printInfo.v1 });
				this.customList = Array.from(new Set(this.customList.map(item => item.value))).filter(item => !!item).map(item => { return { value: item } });
				const customList = this.customList.map(item => item.value);
				localStorage.setItem(`print_custom_${this.userInfo.id}`, customList.toString());
				this.countList.push({ value: this.printInfo.v2 });
				this.countList = Array.from(new Set(this.countList.map(item => item.value))).filter(item => !!item).map(item => { return { value: item } });
				const countList = this.countList.map(item => item.value);
				localStorage.setItem(`print_count_${this.userInfo.id}`, countList.toString());
			}

			utils.gridGrfPrint(`grf/${this.userInfo.id}.grf`, {
				"Detail": [
					{
						v1: this.printInfo.v1,
						v2: this.printInfo.v2,
						address: this.userInfo.address,
						phone1: this.userInfo.phone1,
						phone2: this.userInfo.phone2,
					},
				]
			});
		},
	},
};
</script>
<style scoped>
::v-deep(.ant-picker) {
	border: none !important;
	padding: 0 !important;
	font-size: 18px;
	border-bottom: 1px solid #000 !important;
}

::v-deep(.ant-picker-suffix) {
	display: none !important;
}

::v-deep(.ant-select-selector) {
	width: 100% !important;
	height: 100% !important;
	border: none !important;
	padding: 0 !important;
	font-size: 18px;
	border-bottom: 1px solid #000 !important;
}

::v-deep(.ant-select-selection-search-input) {
	height: 100% !important;
	width: 100% !important;
	white-space: pre-wrap !important;
	word-wrap: break-word !important;
	overflow-wrap: break-word !important;
	word-break: break-all !important;
	text-align: left;
	font-weight: 400;
	font-size: 18px;
}

.v1 {
	font-size: 20px;
	font-weight: 600;
	text-align: center;
}

.border {
	border: 1px solid #000;
}

.center {
	text-align: center;
}

.contact {
	font-size: 16px;
	font-weight: 500;
}
</style>