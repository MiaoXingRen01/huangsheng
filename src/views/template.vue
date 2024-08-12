<template>
  <div :id="$route.name">
    <a-card>
      <template #title>
        <a-row justify="space-between" align="top">
          <a-form layout="inline">
            <a-form-item>
              <a-input placeholder="名称" style="width:180px" v-model:value="searchForm.searchName" allowClear/>
            </a-form-item>
            <a-form-item>
              <a-input placeholder="备注" style="width:320px" v-model:value="searchForm.searchNote" allowClear/>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click.prevent="onSearchClick">查询</a-button>
              <a-button type="link" @click.prevent="onResetClick">重置</a-button>
            </a-form-item>
          </a-form>
          <a-space>
            <a-button type="primary" @click.prevent="onItemEditClick()">
              <i class="ri-add-line"></i>
              <span>添加</span>
            </a-button>
          </a-space>
        </a-row>
      </template>

      <a-table :columns="defaultColumns" @change="handleTableChange" :data-source="pagination.data"
        :pagination="pagination" :rowKey="t => t.id" :scroll="{ x: 1000 }" bordered>
        <template #bodyCell="{ column, record: item }">


          <template v-if="column.key == 'titleSub'">
            <Ellipsis title="副标题" :content="item.titleSub" />
          </template>
          <template v-if="column.key == 'icon'">
            <i style="font-size: 20px;" :class="item.icon"></i>
          </template>
          <template v-if="column.key == 'action'">
            <a href="javascript:;" @click.prevent="onItemEditClick(item)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click.prevent="onItemDeleteClick(item)">删除</a>
          </template>
          <template v-if="column.key == 'bgColor'">
            <div
              :style="{ width: '100%', backgroundColor: item.bgColor, display: 'inline-block', padding: '0 8px', height: '22px', color: item.fontColor || '#fff' }">
              {{ item.bgColor }}</div>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="showAddModal" :title="!!editEntity.id ? '编辑' : '新增'" width="600px" centered
      @cancel="editEntity = {}" @ok="onSubmitEditEntityClick" :maskClosable="!!editEntity.id">
      <template #footer>
        <a-button key="back" @click="editEntity = {}">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="onSubmitEditEntityClick">确定</a-button>
      </template>
      <a-form :labelCol="{ span: 7 }" :wrapperCol="{ span: 13 }">
        <a-form-item label="名称" required>
          <a-input placeholder="请输入" v-model:value="editEntity.name" :disabled="editEntity.readonly" />
        </a-form-item>
        <a-form-item label="背景色" required>
          <color-picker v-model:pureColor="editEntity.bgColor" />
        </a-form-item>
        <a-form-item label="图标" required>
          <a-select :filterOption="(input, option) => option.value.indexOf(input) > -1" allowClear
            dropdown-class-name="select-icon" v-model:value="editEntity.icon"
            :options="menuIcons.map(item => ({ value: item }))" show-search placeholder="请输入" option-label-prop="label"
            style="width: 100%;">
            <template #option="{ value }">
              <i :class="value" />&nbsp;&nbsp;{{ value }}
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea placeholder="请输入" v-model:value="editEntity.note" :disabled="editEntity.readonly"
            style="width: 100%;" />
        </a-form-item>
        <a-form-item label="排序号">
          <a-input-number placeholder="请输入" v-model:value="editEntity.sortno" :disabled="editEntity.readonly"
            style="width: 100%;" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
  
<script>
import Ellipsis from '@/components/ellipsis/index'
import app from "@/app.js";
import utils from "@/config/utils.js";
import statusUtil from "@/config/statusUtil.js";
import { DEFAULT, URLS } from "@/config/config.js";
import menuIcons from "@/components/remixicon/all-icon-list.json";

export default {
  components: {
    Ellipsis,
  },
  data() {
    return {
      loading: false,
      sortField: "",
      sortOrder: "",
      editEntity: {},
      showAddModal: false,
      statusUtil,
      searchForm: {},
      menuIcons,
      defaultColumns: [
        { title: "名称", dataIndex: "name", width: 100 },
        { title: "图标", dataIndex: "icon", key: "icon", width: 50 },
        { title: "背景色", key: "bgColor", width: 80 },
        { title: "备注", dataIndex: "note", width: 200 },
        { title: "排序号", dataIndex: "sortno", width: 50 },
        {
          title: "添加时间", dataIndex: "addTime", width: 100, customRender: ({ text, record, index, column }) => {
            return utils.dateTimeFormat(text
            );
          },
        },
        { title: "操作", key: "action", width: 80 },
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
    this.onResetClick();
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.sortField = sorter.field;
      this.sortOrder = sorter.order;
      this.requestData(true);
    },
    async onSubmitEditEntityClick() {
      const { editEntity } = this;
      if (editEntity.readonly) {
        this.showAddModal = false;
        this.editEntity = {};
        return;
      }
      let params = {};
      if (!utils.isEmpty(editEntity.id)) {
        params.id = editEntity.id;
      }
      if (utils.isEmpty(editEntity.name)) {
        app.showToast("请输入名称");
        return;
      }
      if (utils.isEmpty(editEntity.icon)) {
        app.showToast("请选择图标");
        return;
      }
      if (utils.isEmpty(editEntity.bgColor)) {
        app.showToast("请选择背景色");
        return;
      }
      for (const key in editEntity) {
        if (!!editEntity[key]) {
          params[key] = (editEntity[key] + "").trim();
        }
      }
      this.loading = true;
      let res = await app.postAsync(URLS.POLICY_TYPE_SAVE, params);
      this.loading = false;
      if (res.status == 0) {
        app.showToast(res.message);
        this.showAddModal = false;
        this.editEntity = {};
        this.requestData(true);
      }
    },
    onItemEditClick(item = {}) {
      this.editEntity = { ...item };
      this.showAddModal = true;
    },
    onItemDeleteClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定删除？",
        onOk: async () => {
          app.showLoading();
          const res = await app.postAsync(URLS.POLICY_TYPE_DEL, {
            id: item.id,
          });
          app.hideLoading();
          if (res.status == 0) {
            app.showToast(res.message);
            this.requestData(true);
          }
        },
      });
    },
    onSearchClick() {
      let pageEntity = this.pagination;
      pageEntity.current = 1;
      this.requestData(true);
    },
    onResetClick() {
      this.searchForm = {};
      this.onSearchClick();
    },
    async requestData(showLoading = false) {
      let { sortField, sortOrder } = this;
      let pageEntity = this.pagination;
      if (showLoading) {
        app.showLoading();
      }
      const params = {
        page: pageEntity.current,
        limit: pageEntity.pageSize,
        ...this.searchForm
      };
      if (!utils.isEmpty(sortField)) {
        params.orderField = sortField;
        params.orderType =
          sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
      }
      const res = await app.postAsync(URLS.POLICY_TYPE_LIST, params);
      if (showLoading) {
        app.hideLoading();
      }
      if (res.status == 0) {
        const { data } = res;
        pageEntity.current = data.page;
        pageEntity.total = data.count;
        pageEntity.data = data.data;
      }
      this.pagination = pageEntity;
    },
  },
};
</script>
<style scoped>
::v-deep(.vc-color-wrap) {
  width: 100%;
}
</style>