<template>
    <div :id="$route.name">
        <a-card>
            <template #title>
                <a-row justify="space-between" align="top">
                    <a-space>
                        <a-button type="primary" @click.prevent="onItemEditClick()">
                            <i class="ri-add-line"></i>
                            <span>添加菜单</span>
                        </a-button>
                    </a-space>
                </a-row>
            </template>
            <a-row type="flex" :gutter="16">
                <a-col flex="0 0 256px" :style="{ overflow: 'hidden' }">
                    <a-card>
                        <a-tree v-if="menuList.length>0" :defaultExpandAll="true" :checkStrictly="true" :tree-data="menuList" show-line @select="onTreeSelectClick" :fieldNames="{key:'id',title:'title',value:'id'}" />
                    </a-card>
                </a-col>
                <a-col flex="1" :style="{ overflow: 'hidden' }">
                    <a-form class="page-form" layout="inline">
                        <a-form-item>
                            <a-input placeholder="名称" v-model:value="nameLike" style="width: 180px" allowClear/>
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
        <a-modal v-model:visible="showAddMenuModal" title="菜单信息" width="600px" centered :destroyOnClose="true" @cancel="editEntity={}" @ok="onSubmitEditEntityClick">
            <a-form :labelCol="{ span: 7 }" :wrapperCol="{  span: 13 }">
                <a-form-item label="菜单名称" required>
                    <a-input placeholder="请输入" v-model:value="editEntity.title" />
                </a-form-item>
                <a-form-item label="菜单别名" required>
                    <a-input placeholder="请输入" v-model:value="editEntity.name" />
                </a-form-item>
                <a-form-item label="菜单图标">
                    <a-select :filterOption="(input, option)=> option.value.indexOf(input) > -1" allowClear dropdown-class-name="select-icon" v-model:value="editEntity.icon" :options="menuIcons.map(item => ({ value: item }))" show-search placeholder="请输入" option-label-prop="label">
                        <template #option="{value}">
                            <i :class="value" />&nbsp;&nbsp;{{value}}
                        </template>
                    </a-select>
                </a-form-item>
                <a-form-item label="上级菜单" required>
                    <a-tree-select placeholder="请输入" v-model:value="editEntity.parentId" :tree-data="menuList" :fieldNames="{key:'id',label:'name',value:'id'}" />
                </a-form-item>
                <a-form-item label="路径">
                    <a-input placeholder="请输入" v-model:value="editEntity.path" />
                </a-form-item>
                <a-form-item label="排序" help="数字越小，排名越靠前" required>
                    <a-input-number v-model:value="editEntity.sortno" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import app from "../../app.js";
import utils from "../../config/utils.js";
import { DEFAULT, URLS } from "../../config/config.js";
import menuIcons from "../../components/remixicon/all-icon-list.json";
export default {
  data() {
    return {
      sortField: "",
      sortOrder: "",
      editEntity: {},
      showAddMenuModal: false,
      menuIcons: Object.freeze(menuIcons),
      menuList: [],
      nameLike: "",
      parentId: "",
      defaultColumns: [
        { title: "名称", dataIndex: "title" },
        { title: "别名", dataIndex: "name" },
        { title: "图标", key: "icon" },
        { title: "路径", dataIndex: "path" },
        {
          title: "排序",
          dataIndex: "sortno",
          sorter: true,
          align: "center",
        },
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
      if (utils.isEmpty(editEntity.title)) {
        app.showToast("请输入菜单名称");
        return;
      }
      editEntity.title = (editEntity.title + "").trim();
      if (utils.isEmpty(editEntity.name)) {
        app.showToast("请输入菜单别名");
        return;
      }
      editEntity.name = (editEntity.name + "").trim();
      if (!/^\d+$/.test(editEntity.sortno)) {
        app.showToast("请输入排序序号");
        return;
      }
      if (app.utils.isEmpty(editEntity.parentId)) {
        app.showToast("请选择上级菜单");
        return;
      }
      if (editEntity.parentId == editEntity.id) {
        app.showToast(`上级菜单不能选择${editEntity.name}`);
        return;
      }
      app.showLoading();
      const params = {
        name: editEntity.name,
        title: editEntity.title,
        icon: editEntity.icon,
        parentId: editEntity.parentId,
        path: editEntity.path,
        sortno: editEntity.sortno,
      };
      if (!utils.isEmpty(editEntity.id)) {
        params.id = editEntity.id;
      }
      const res = await app.postAsync(URLS.MENU_SAVE, params);
      app.hideLoading();
      if (res.status == 0) {
        app.showToast(res.message);
        this.showAddMenuModal = false;
        this.editEntity = {};
        this.onSearchClick();
      }
    },
    onItemEditClick(item) {
      this.showAddMenuModal = true;
      this.editEntity = { ...item };
    },
    onItemDeleteClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要删除该菜单吗？",
        onOk: async () => {
          app.showLoading();
          let res = await app.postAsync(URLS.MENU_DEL, {
            menuId: item.id,
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
      this.nameLike = "";
      this.onSearchClick();
    },
    async requestData(showLoading = false) {
      let { nameLike, parentId = "", sortField, sortOrder } = this;
      let pageEntity = this.pagination;
      if (showLoading) {
        app.showLoading();
      }
      const params = {
        page: pageEntity.current,
        limit: pageEntity.pageSize,
        parentId,
      };
      if (!utils.isEmpty(nameLike)) {
        params.menu = nameLike;
      }
      if (!utils.isEmpty(sortField)) {
        params.orderField = sortField;
        params.orderType =
          sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
      }
      let res = await app.postAsync(URLS.MENU_LIST, params);
      if (res.status == 0) {
        let data = res.data;
        pageEntity.current = data.page;
        pageEntity.total = data.count;
        pageEntity.data = data.data;
        this.pagination = pageEntity;
      }
      res = await app.postAsync(URLS.MENU_TREE_LIST, { showRoot: "y" });
      if (res.status == 0) {
        this.menuList = res.data;
      }
      if (showLoading) {
        app.hideLoading();
      }
    },
  },
};
</script>