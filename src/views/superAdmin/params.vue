<template>
  <div :id="$route.name">
      <a-card>
          <template #title>
              <a-row justify="space-between" align="top">
                  <a-form layout="inline">
                      <a-form-item>
                          <a-input placeholder="名称/编号" v-model:value="nameLike" style="width: 180px" allowClear/>
                      </a-form-item>
                      <a-form-item>
                          <a-button type="primary" @click.prevent="onSearchClick">查询</a-button>
                          <a-button type="link" @click.prevent="onResetClick">重置</a-button>
                      </a-form-item>
                  </a-form>
                  <a-space>
                      <a-button type="primary" @click.prevent="onItemEditClick({operation:'add'})">
                          <i class="ri-add-line"></i>
                          <span>添加</span>
                      </a-button>
                  </a-space>
              </a-row>
          </template>

          <a-table :columns="defaultColumns" @change="handleTableChange" :data-source="pagination.data" :pagination="pagination" :rowKey="t => t.code" :scroll="{ x: 1400 }" bordered>
              <template #bodyCell="{ column,  record:item }">
                  <template v-if="column.key=='action'">
                      <a href="javascript:;" @click.prevent="onItemEditClick(item)">编辑</a>
                      <a-divider type="vertical" />
                      <a href="javascript:;" @click.prevent="onItemDetailClick(item)">查看明细</a>
                      <a-divider type="vertical" />
                      <a href="javascript:;" @click.prevent="onItemDelClick(item)">删除</a>
                  </template>
              </template>
          </a-table>
      </a-card>

      <a-modal v-model:visible="showAddParamModal" title="修改" width="600px" centered @cancel="editEntity={}" @ok="onSubmitEditEntityClick">
          <a-form :labelCol="{ span: 7 }" :wrapperCol="{  span: 13 }">
              <a-form-item label="编号" required>
                  <a-input placeholder="请输入" v-model:value="editEntity.code" :disabled="editEntity.operation!='add'" />
              </a-form-item>
              <a-form-item label="名称" required>
                  <a-input placeholder="请输入" v-model:value="editEntity.name" :disabled="editEntity.operation!='add'" />
              </a-form-item>
              <a-form-item label="值1">
                  <a-input placeholder="请输入" v-model:value="editEntity.value1" />
              </a-form-item>
              <a-form-item label="值2">
                  <a-input placeholder="请输入" v-model:value="editEntity.value2" />
              </a-form-item>
              <a-form-item label="描述">
                  <a-textarea placeholder="请输入" :rows="4" allow-clear v-model:value="editEntity.description" />
              </a-form-item>
          </a-form>
      </a-modal>
      <a-modal v-model:visible="showDetailModal" title="字典明细" :footer="null" destroyOnClose width="1000px">
          <paramsDictList :code="selectDictCode" />
      </a-modal>
  </div>
</template>

<script>
import app from "../../app.js";
import statusUtil from "../../config/statusUtil.js";
import utils from "../../config/utils.js";
import { DEFAULT, URLS } from "../../config/config.js";
import paramsDictList from "./paramsDictList.vue";
export default {
components: { paramsDictList },
data() {
  return {
    sortField: "",
    sortOrder: "",
    editEntity: {},
    showAddParamModal: false,
    showDetailModal: false,
    selectDictCode: "",
    statusUtil,
    nameLike: "",
    defaultColumns: [
      { title: "名称", dataIndex: "name", width: 110, fixed: 'left' },
      { title: "编号", dataIndex: "code", width: 140 },
      { title: "值1", dataIndex: "value1", width: 200 },
      { title: "值2", dataIndex: "value2", width: 100 },
      { title: "描述", dataIndex: "description", width: 160 },
      { title: "操作", key: "action", width: 100 },
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
  this.requestData(true);
},
methods: {
  onItemDelClick(item) {
    this.$confirm({
      title: "提示",
      content: "确定要删除该参数吗？",
      onOk: async () => {
        app.showLoading();
        let res = await app.postAsync(URLS.PARAM_DEL, {
          code: item.code,
        });
        app.hideLoading();
        if (res.status == 0) {
          app.showToast(res.message);
          this.onSearchClick();
        }
      },
    });
  },
  async onItemDetailClick(item) {
    this.selectDictCode = item.code;
    this.showDetailModal = true;
  },
  handleTableChange(pagination, filters, sorter) {
    this.pagination.current = pagination.current;
    this.pagination.pageSize = pagination.pageSize;
    this.sortField = sorter.field || "";
    this.sortOrder = sorter.order || "";
    this.requestData(true);
  },
  async onSubmitEditEntityClick() {
    const { editEntity } = this;
    if (editEntity.operation != "add") {
      editEntity.operation = "edit";
    }
    app.showLoading();
    const res = await app.postAsync(URLS.PARAM_SAVE, editEntity);
    app.hideLoading();
    if (res.status == 0) {
      app.showToast(res.message);
      this.showAddParamModal = false;
      this.editEntity = {};
      this.onSearchClick();
    }
  },
  onItemEditClick(item) {
    this.showAddParamModal = true;
    this.editEntity = { ...item };
  },
  onSearchClick() {
    let pageEntity = this.pagination;
    pageEntity.current = 1;
    this.requestData(true);
  },
  onResetClick() {
    this.nameLike = "";
    this.onSearchClick();
  },
  async requestData(showLoading = false) {
    let { nameLike, sortField, sortOrder } = this;
    let pageEntity = this.pagination;
    if (showLoading) {
      app.showLoading();
    }
    let params = {
      page: pageEntity.current,
      limit: pageEntity.pageSize,
    };
    if (!utils.isEmpty(nameLike)) {
      params.param = nameLike;
    }
    if (!utils.isEmpty(sortField)) {
      params.orderField = sortField;
      params.orderType =
        sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
    }
    let res = await app.postAsync(URLS.PARAM_LIST, params);
    if (res.status == 0) {
      let data = res.data;
      pageEntity.current = data.page;
      pageEntity.total = data.count;
      pageEntity.data = data.data;
      this.pagination = pageEntity;
    }
    if (showLoading) {
      app.hideLoading();
    }
  },
},
};
</script>
