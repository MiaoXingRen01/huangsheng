<template>
    <div :id="$route.name">
        <a-card>
            <template #title>
                <a-row justify="space-between">
                    <a-form layout="inline">
                        <a-form-item>
                            <a-input placeholder="账号" v-model:value="accountLike" style="width: 180px" allowClear/>
                        </a-form-item>
                        <a-form-item>
                            <a-select placeholder="登录类型" v-model:value="searchLoginType" style="width: 180px" allowClear>
                                <a-select-option v-for="item in loginTypeList" :key="item" :value="item">{{item}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item >
                            <a-range-picker v-model:value="searchDate" allowClear/>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click.prevent="onSearchClick">查询</a-button>
                            <a-button type="link" @click.prevent="onResetClick">重置</a-button>
                        </a-form-item>
                    </a-form>
                </a-row>
            </template>

            <a-table :columns="defaultColumns" @change="handleTableChange" :data-source="pagination.data" :pagination="pagination" :rowKey="t => t.id" :scroll="{ x: 1000 }" bordered>
            </a-table>
        </a-card>
    </div>
</template>

<script>
import app from "../../app.js";
import utils from "../../config/utils.js";
import { DEFAULT, URLS } from "../../config/config.js";
export default {
  data() {
    return {
      sortField: "",
      sortOrder: "",
      searchLoginType: null,
      searchDate: [],
      accountLike: "",
      loginTypeList: ["web", "app", "miniprogram"],
      defaultColumns: [
        {
          title: "账号",
          dataIndex: "account",
        },
        {
          title: "ip地址",
          dataIndex: "ip",
        },
        {
          title: "说明",
          dataIndex: "location",
        },
        {
          title: "登录时间",
          dataIndex: "loginTime",
        },
        {
          title: "登录类型",
          dataIndex: "loginType",
        },
      ],
      pagination: {
        current: 1,
        pageSize: parseInt(DEFAULT.PAGE_SIZE_OPTIONS[0]),
        showQuickJumper: true,
        showSizeChanger: true,
        data: [],
        total: 0,
        pageSizeOptions: DEFAULT.PAGE_SIZE_OPTIONS,
        showTotal: () => `共 ${this.pagination.total} 条`,
      },
    };
  },
  async mounted() {
    this.onSearchClick();
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.sortField = sorter.field;
      this.sortOrder = sorter.order;
      this.requestData(true);
    },
    onSearchClick() {
      let pageEntity = this.pagination;
      pageEntity.current = 1;
      this.requestData(true);
    },
    onResetClick() {
      this.accountLike = this.searchLoginType = null;
      this.searchDate = [];
      this.onSearchClick();
    },
    async requestData(showLoading = false) {
      let { accountLike, searchLoginType, searchDate, sortField, sortOrder } =
        this;
      let pageEntity = this.pagination;
      if (showLoading) {
        app.showLoading();
      }
      let params = {
        page: pageEntity.current,
        limit: pageEntity.pageSize,
      };
      if (!utils.isEmpty(accountLike)) {
        params.account = accountLike;
      }
      if (!utils.isEmpty(searchLoginType)) {
        params.loginType = searchLoginType;
      }
      if (searchDate.length > 1) {
        params.beginDate = searchDate[0].format("YYYY-MM-DD");
        params.endDate = searchDate[1].format("YYYY-MM-DD");
      }
      if (!utils.isEmpty(sortField)) {
        params.orderField = sortField;
        params.orderType =
          sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
      }
      let res = await app.postAsync(URLS.LOGIN_LOG_LIST, params);
      if (res.status == 0) {
        let data = res.data;
        pageEntity.current = data.page;
        pageEntity.total = data.count;
        pageEntity.data = data.data;
      }
      this.pagination = pageEntity;
      if (showLoading) {
        app.hideLoading();
      }
    },
  },
};
</script>
