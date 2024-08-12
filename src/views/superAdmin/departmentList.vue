<template>
    <div :id="$route.name">
        <a-card>
            <template #title>
                <a-row justify="space-between" align="top">
                    <a-space>
                        <a-button type="primary" @click.prevent="onItemEditClick()">
                            <i class="ri-add-line"></i>
                            <span>添加部门</span>
                        </a-button>
                    </a-space>
                </a-row>
            </template>
            <a-row type="flex" :gutter="16">
                <a-col flex="0 0 256px" :style="{ overflow: 'hidden' }">
                    <a-card>
                        <a-tree v-if="treeList.length>0" :defaultExpandAll="true" :checkStrictly="true" :tree-data="treeList" show-line @select="onTreeSelectClick" :fieldNames="{key:'id',title:'name',value:'id'}" />
                    </a-card>
                </a-col>
                <a-col flex="1" :style="{ overflow: 'hidden' }">
                    <a-form class="page-form" layout="inline">
                        <a-form-item>
                            <a-input style="width:320px" placeholder="名称/联系人/联系电话/地址" v-model:value="searchText" />
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click.prevent="onSearchClick">查询</a-button>
                            <a-button type="link" @click.prevent="onResetClick">重置</a-button>
                        </a-form-item>
                    </a-form>
                    <a-table :columns="defaultColumns" @change="handleTableChange" :data-source="pagination.data" :pagination="pagination" :rowKey="t => t.id" :scroll="{ x: 1000 }" bordered>
                        <template #bodyCell="{ column,  record:item }">
                            <div v-if="column.key=='icon'" class="icon-cell">
                                <i :class="item.icon" />&nbsp;&nbsp;{{item.icon}}
                            </div>
                            <template v-if="column.key=='action'">
                                <a href="javascript:;" @click.prevent="onItemEditClick(item)">编辑</a>
                                <a-divider type="vertical" />
                                <a href="javascript:;" @click.prevent="onItemDeleteClick(item)">删除</a>
                            </template>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-card>

        <a-modal v-model:visible="showAddModal" destroyOnClose title="部门信息" @cancel="editEntity={}" @ok="onSubmitEditEntityClick" :width="1000">
            <div class="add-form-page">
                <a-form :labelCol="{ flex: ' 0 0 6em' }" :wrapperCol="{ flex: '1' }" labelAlign="left">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item label="部门名称" required>
                                <a-input placeholder="请输入" v-model:value="editEntity.name" />
                            </a-form-item>
                            <a-form-item label="联系人" required>
                                <a-input placeholder="请输入" v-model:value="editEntity.linkName" />
                            </a-form-item>
                            <a-form-item label="联系电话" required>
                                <a-input placeholder="请输入" v-model:value="editEntity.linkPhone" />
                            </a-form-item>
                            <a-form-item label="上级部门" required>
                                <a-tree-select placeholder="请输入" v-model:value="editEntity.parentId" :tree-data="treeList" :fieldNames="{key:'id',label:'name',value:'id'}" />
                            </a-form-item>
                            <a-form-item label="省市区">
                                <a-input placeholder="请输入" :disabled="true" :value="`${editEntity.province?editEntity.province+',':''}${editEntity.city?editEntity.city+',':''}${editEntity.county?editEntity.county+',':''}`" />
                            </a-form-item>
                            <a-form-item label="详细地址">
                                <a-input placeholder="请输入" v-model:value="editEntity.address" />
                            </a-form-item>
                            <a-form-item label="排序" help="数字越小，排名越靠前" required>
                                <a-input-number v-model:value="editEntity.sortno" />
                            </a-form-item>
                            <a-form-item label="备注">
                                <a-input placeholder="请输入" v-model:value="editEntity.note" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <selectMapPoint :point="{lat:editEntity.lat,lng:editEntity.lng}" :immediately="true" @update:result="onPointCallback" />
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script>
import app from "../../app.js";
import { DEFAULT, URLS } from "../../config/config.js";
import utils from "../../config/utils.js";
import selectMapPoint from "../../components/selectMapPoint.vue";
export default {
  components: { selectMapPoint },
  data() {
    return {
      sortField: "",
      sortOrder: "",
      editEntity: {},
      showAddModal: false,
      treeList: [],
      searchText: "",
      parentId: "",
      defaultColumns: [
        { title: "部门名称", dataIndex: "name" },
        { title: "联系人", dataIndex: "linkName" },
        { title: "联系电话", dataIndex: "linkPhone" },
        { title: "上级部门", dataIndex: "parentName" },
        { title: "省", dataIndex: "province" },
        { title: "市", dataIndex: "city" },
        { title: "区", dataIndex: "county" },
        { title: "详细地址", dataIndex: "address", width: 200 },
        { title: "排序", dataIndex: "sortno", align: "center" },
        { title: "备注", dataIndex: "note" },
        { title: "操作", key: "action", width: 140 },
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
    onPointCallback(e) {
      const { editEntity } = this;
      editEntity.province = e.province;
      editEntity.city = e.city;
      editEntity.county = e.district;
      editEntity.address = e.address;
      editEntity.lat = e.lat;
      editEntity.lng = e.lng;
      this.showMapModal = false;
    },
    onTreeSelectClick(keys) {
      this.parentId = keys[0] || "";
      this.onSearchClick();
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.sortField = sorter.field;
      this.sortOrder = sorter.order;
      this.requestData(true);
    },
    async onSubmitEditEntityClick() {
      let { editEntity } = this;
      if (utils.isEmpty(editEntity.name)) {
        app.showToast("请输入部门名称");
        return;
      }
      editEntity.name = (editEntity.name + "").trim();
      if (utils.isEmpty(editEntity.linkName)) {
        app.showToast("请输入联系人");
        return;
      }
      editEntity.linkName = (editEntity.linkName + "").trim();
      if (utils.isEmpty(editEntity.linkPhone)) {
        app.showToast("请输入联系电话");
        return;
      }
      editEntity.linkPhone = (editEntity.linkPhone + "").trim();
      if (utils.isEmpty(editEntity.name)) {
        app.showToast("请输入部门名称");
        return;
      }
      editEntity.name = (editEntity.name + "").trim();
      if (!/^\d+$/.test(editEntity.sortno)) {
        app.showToast("请输入排序序号");
        return;
      }
      if (app.utils.isEmpty(editEntity.parentId)) {
        app.showToast("请选择上级部门");
        return;
      }
      if (editEntity.parentId == editEntity.id) {
        app.showToast(`上级部门不能选择${editEntity.name}`);
        return;
      }
      app.showLoading();
      const res = await app.postAsync(URLS.SUPER_DEPARTMENT_SAVE, editEntity);
      app.hideLoading();
      if (res.status == 0) {
        app.showToast(res.message);
        this.showAddModal = false;
        this.editEntity = {};
        this.onSearchClick();
      }
    },
    onItemEditClick(item) {
      this.showAddModal = true;
      this.editEntity = { ...item };
    },
    onItemDeleteClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要删除该部门吗？",
        onOk: async () => {
          app.showLoading();
          const res = await app.postAsync(URLS.SUPER_DEPARTMENT_DEL, {
            deptId: item.id,
          });
          app.hideLoading();
          if (res.status == 0) {
            app.showToast(res.message);
            this.onSearchClick();
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
      this.searchText = "";
      this.onSearchClick();
    },
    async requestData(showLoading = false) {
      let { searchText, parentId = "", sortField, sortOrder } = this;
      let pageEntity = this.pagination;
      if (showLoading) {
        app.showLoading();
      }
      const params = {
        page: pageEntity.current,
        limit: pageEntity.pageSize,
        parentId,
      };
      if (!utils.isEmpty(searchText)) {
        params.keyword = searchText;
      }
      if (!utils.isEmpty(sortField)) {
        params.orderField = sortField;
        params.orderType =
          sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
      }
      let res = await app.postAsync(URLS.SUPER_DEPARTMENT_LIST, params);
      if (res.status == 0) {
        let data = res.data;
        pageEntity.current = data.page;
        pageEntity.total = data.count;
        pageEntity.data = data.data;
        this.pagination = pageEntity;
      }
      res = await app.postAsync(URLS.SUPER_DEPARTMENT_TREE_LIST, {
        showRoot: "y",
      });
      if (res.status == 0) {
        this.treeList = res.data;
      }
      if (showLoading) {
        app.hideLoading();
      }
    },
  },
};
</script>