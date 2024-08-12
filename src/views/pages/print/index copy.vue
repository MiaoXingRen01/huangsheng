<template>
	<div :id="$route.name">
		<a-card style="height: 88vh; ">
			<a-row :gutter="16" justify="center">
				<a-col :span="6">
				</a-col>
				<a-col :span="12">
					<div
						style="border: 1px dashed #aaa; padding: 20px 20px 20px; border-radius: 5px; margin-top: 100px; position: relative; ">

						<div
							style="position: absolute; right: 20px; bottom: 14px; display: flex; align-items: flex-end; flex-flow: column; ">
							<a-image style="width: 55px; margin-left: 5px; " v-if="!!userInfo.id"
								:src="require(`@/assets/qrcode/${userInfo.id}.png`)"></a-image>
							<div style="font-size: 10px;">扫一扫查看公司产品详情</div>
						</div>
						<div style=" height: 40px; ">
							<span
								style=" padding-left: 74px; font-size: 14px; font-weight:500; display: flex; margin-bottom: 10px; justify-content: center; align-items:self-end; ">
								<span style="font-size: 22px; letter-spacing: 5px;">{{ printInfo.v0 }}</span>
								<span style="letter-spacing: 2px;margin-left: 10px;">货物运单</span>
							</span>
						</div>
						<div style="display: flex ; justify-content: space-between; ">
							<div>
								<span>No：</span>
								<span>{{ no }}</span>
							</div>
							<div>

								<span>日期：</span>
								<span> <a-date-picker style="width: 72px;" :allowClear="false" v-model:value="date"
										placeholder="选择日期" /></span>
							</div>
						</div>
						<table style=" border: 1px solid #000; border-bottom: none;  width: 100%; border-collapse: collapse;" border="1"
							cellspacing="0" cellpadding="0">
							<thead>
								<tr>
									<th class=" text-sm h-[40px] border center">收件人</th>
									<th colspan="5" class=" text-sm h-[40px] border">
										<a-auto-complete v-model:value="printInfo.v1" :options="userList"
											style="width: 100%; height: 100%" placeholder=""
											:filter-option="filterOption" allowClear />
									</th>
									<th class=" text-sm h-[40px] border center">联系方式</th>
									<th colspan="2" class=" text-sm h-[40px] border">
										<a-auto-complete v-model:value="printInfo.v2" :options="phoneList"
											style="width: 100%; height: 100%" placeholder=""
											:filter-option="filterOption" allowClear />
									</th>
								</tr>
								<tr>
									<th colspan="5" class=" text-sm h-[40px] border center">货物名称</th>
									<th colspan="3" class=" text-sm h-[40px] border center">规格</th>
									<th class="text-sm h-[40px] border center">数量</th>
								</tr>
								<tr>
									<th colspan="5" class="text-sm h-[40px] border center">
										<a-auto-complete v-model:value="printInfo.v3" :options="productList"
											style="width: 100%; height: 100%" placeholder=""
											:filter-option="filterOption" allowClear />
									</th>
									<th colspan="3" class=" text-sm h-[40px] border center">
										<a-auto-complete v-model:value="printInfo.v4" :options="normsList"
											style="width: 100%; height: 100%" placeholder=""
											:filter-option="filterOption" allowClear />
									</th>
									<th class="text-sm h-[40px] border center">
										<a-auto-complete v-model:value="printInfo.v5" :options="countList"
											style="width: 100%; height: 100%" placeholder=""
											:filter-option="filterOption" allowClear />
									</th>
								</tr>
								<tr >
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									<th class="w-[100px] text-sm h-[0px] center"></th>
									</tr>
							</thead>
						</table>
						<div style="width: 70%; margin-top: 6px;">
							<div style="display: flex; justify-content: space-between; ">
								<span>
									<span>地址：</span>
									<span>周村沙发材料市场xxxxx</span>
								</span>
							</div>
							<div>
								<span>手机：</span>
								<span>
									<span>13864366777 </span>
									<span>13964477666</span>
								</span>
							</div>
							<div>
								<span>
									<span>电话：</span>
									<span>6186766</span>
								</span>
							</div>
						</div>
					</div>
					<div style="text-align: center; margin-top: 24px;">
						<a-button style="width: 100%; padding: 10px 0; font-size: 16px; height: 44px " @click="print">
							打印
						</a-button>
					</div>
				</a-col>

				<a-col :span="6">
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
			userList: [],
			phoneList: [],
			productList: [],
			normsList: [],
			countList: [],
			date: dayjs(),
			no: null,

		};
	},
	async mounted() {
		this.userInfo = accountJson[app.getToken()];
		this.productList = this.userInfo.productList.map(item => { return { value: item.name } });
		this.normsList = this.userInfo.normsList.map(item => { return { value: item.name } });
		this.printInfo.v0 = app.userInfo.get().name;
		this.no = dayjs().valueOf();
	},
	methods: {
		filterOption(input, option) {
			return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
				|| chineseToPinYin(option.value).toUpperCase().indexOf(input.toUpperCase()) >= 0
				|| firstPinyin(option.value).toUpperCase().indexOf(input.toUpperCase()) >= 0;
		},
		print() {
			utils.gridGrfPrint(`grf/${this.userInfo.id}.grf`, {
				"Detail": [
					{ "title1": 2, "danhao": "牛奶", },
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
	font-size: 12px;
}

::v-deep(.ant-picker-suffix) {
	display: none !important;
}

::v-deep(.ant-select-selector) {
	width: 100% !important;
	height: 100% !important;
	border: none !important;
	padding: 0 !important;
	font-size: 12px;
}

::v-deep(.ant-select-selection-search-input) {
	height: 100% !important;
	width: 100% !important;
	white-space: pre-wrap !important;
	word-wrap: break-word !important;
	overflow-wrap: break-word !important;
	word-break: break-all !important;
	text-align: center;
	font-weight: 400;
	font-size: 12px;
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
</style>