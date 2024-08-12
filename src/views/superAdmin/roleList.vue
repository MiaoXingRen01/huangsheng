<template>
  <div :id="$route.name">
    <a-card>
      <template #title>
        <a-row justify="space-between" align="top">
          <a-form layout="inline">
            <a-form-item>
              <a-input placeholder="角色名称" v-model:value="nameLike" style="width: 180px" allowClear/>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click.prevent="onSearchClick">查询</a-button>
              <a-button type="link" @click.prevent="onResetClick">重置</a-button>
            </a-form-item>
          </a-form>
          <a-space>
            <a-button type="primary" @click.prevent="onItemEditClick()">
              <i class="ri-add-line"></i>
              <span>添加角色</span>
            </a-button>
          </a-space>
        </a-row>
      </template>

      <a-table :columns="defaultColumns" @change="handleTableChange" :data-source="pagination.data" :pagination="pagination" :rowKey="t => t.id" :scroll="{ x: 1000 }" bordered>
        <template #bodyCell="{ column,  record:item }">
          <template v-if="column.key=='action'">
            <a href="javascript:;" @click.prevent="onItemEditClick(item)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click.prevent="onItemEditPermissionsClick(item)">分配菜单</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click.prevent="onItemClearPermissionsClick(item)">清空菜单</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click.prevent="onItemDeleteClick(item)">删除</a>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="showAddRoleModal" title="角色信息" width="600px" centered @cancel="editEntity={}" @ok="onSubmitEditEntityClick">
      <a-form :labelCol="{ span: 7 }" :wrapperCol="{  span: 13 }">
        <a-form-item label="角色级别" required>
          <a-radio-group v-model:value="editEntity.level">
            <a-radio-button v-for="item in levelList" :key="item.value" :value="item.value">{{item.name}}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="角色编码" required>
          <a-input placeholder="请输入" v-model:value="editEntity.id" />
        </a-form-item>
        <a-form-item label="角色名称" required>
          <a-input placeholder="请输入" v-model:value="editEntity.name" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea placeholder="请输入" :rows="4" allow-clear v-model:value="editEntity.note" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :visible="!!permissionEntity.id" title="菜单分配" centered @cancel="permissionEntity={}" @ok="onSubmitPermissionClick">
      <a-tree @check="onTreeChecked" checkStrictly checkable defaultExpandAll :tree-data="permissionEntity.permissionList" v-if="permissionEntity.permissionList&&permissionEntity.permissionList.length" :fieldNames="{key:'id',title:'name'}" :checkedKeys="permissionEntity.checkedPermissionList" />
      <template #footer>
        <a-row type="flex" justify="space-between">
          <a-col>
            <a-button @click.prevent="onSelectAllClick">全选</a-button>
            <a-button @click.prevent="permissionEntity.checkedPermissionList=[]">清空</a-button>
          </a-col>
          <a-col>
            <a-button @click.prevent="permissionEntity={}">取消</a-button>
            <a-button @click.prevent="onSubmitPermissionClick" type="primary">确定</a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
  </div>
</template>

<script>
import app from "../../app.js";
import { DEFAULT, URLS } from "../../config/config.js";
import utils from "../../config/utils.js";
import { getCheckedKeys, onTreeCheckChanged } from "../../config/treeUtil.js";
export default {
  data() {
    return {
      sortField: "",
      sortOrder: "",
      showAddRoleModal: false,
      showRolePermissionModal: false,
      editEntity: {},
      permissionEntity: { checkedPermissionList: [] },
      nameLike: "",
      levelList: [
        { name: "系统级", value: "system" },
        { name: "用户级", value: "user" },
      ],
      defaultColumns: [
        { title: "编码", dataIndex: "id" },
        { title: "名称", dataIndex: "name" },
        { title: "备注", dataIndex: "note" },
        {
          title: "级别",
          customRender: ({ text, record, index, column }) => {
            return (
              (this.levelList.filter((t) => t.value == record.level)[0] || {})
                .name || ""
            );
          },
        },
        { title: "添加人", dataIndex: "updName" },
        { title: "添加日期", dataIndex: "updTime" },
        { title: "操作", key: "action", width: 280 },
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
    onTreeChecked(vModel, { node: { dataRef } }) {
      const {
        permissionEntity: { permissionList = [] },
      } = this;
      this.permissionEntity.checkedPermissionList = onTreeCheckChanged(
        permissionList,
        vModel,
        dataRef
      );
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.sortField = sorter.field;
      this.sortOrder = sorter.order;
      this.requestData(true);
    },
    async onSubmitEditEntityClick() {
      const editEntity = { ...this.editEntity };
      if (utils.isEmpty(editEntity.level)) {
        app.showToast("请选择角色级别");
        return;
      }
      if (utils.isEmpty(editEntity.id)) {
        app.showToast("请输入角色编码");
        return;
      }
      editEntity.id = (editEntity.id + "").trim();
      if (utils.isEmpty(editEntity.name)) {
        app.showToast("请输入角色名称");
        return;
      }
      editEntity.name = (editEntity.name + "").trim();
      delete editEntity.updAccount;
      delete editEntity.updName;
      delete editEntity.updTime;
      let res = await app.postAsync(URLS.SUPER_ROLE_SAVE, editEntity);
      if (res.status == 0) {
        app.showToast(res.message);
        this.showAddRoleModal = false;
        this.editEntity = {};
        this.onSearchClick();
      }
    },

    onItemEditClick(item) {
      this.showAddRoleModal = true;
      let editEntity = { ...item };
      this.editEntity = editEntity;
    },
    onItemDeleteClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要删除该角色吗？",
        onOk: async () => {
          app.showLoading();
          let res = await app.postAsync(URLS.SUPER_ROLE_DEL, {
            roleId: item.id,
          });
          app.hideLoading();
          if (res.status == 0) {
            app.showToast(res.message);
            this.onSearchClick();
          }
        },
      });
    },
    onSelectAllClick() {
      let checkedPermissionList = [];
      let fun = (list) => {
        list.forEach((t) => {
          checkedPermissionList.push(t.id);
          if (t.children && t.children.length > 0) {
            fun(t.children);
          }
        });
      };
      fun(this.permissionEntity.permissionList);
      this.permissionEntity.checkedPermissionList = {
        checked: checkedPermissionList,
        halfChecked: [],
      };
    },
    async onItemEditPermissionsClick(item) {
      let res = await app.postAsync(URLS.SUPER_ROLE_MENU_LIST, {
        roleId: item.id,
      });
      if (res.status == 0) {
        let entity = { ...item };
        const { allMenus = [], roleMenus = [] } = res.data;
        entity.permissionList = allMenus;
        entity.checkedPermissionList = getCheckedKeys(allMenus, roleMenus);
        // let fun = (list) => {
        //   list.forEach((t) => {
        //     if (t.children && t.children.length > 0) {
        //       fun(t.children);
        //     } else {
        //       if (t.checked) {
        //         entity.checkedPermissionList.push(t.id);
        //       }
        //     }
        //   });
        // };
        // fun(roleMenus);
        this.permissionEntity = entity;
      }
    },
    async onSubmitPermissionClick() {
      const { permissionEntity } = this;
      const { checked, halfChecked } = permissionEntity.checkedPermissionList;
      const menuIds = [...checked, ...halfChecked];
      app.showLoading();
      const res = await app.postAsync(URLS.SUPER_ROLE_MENU_SAVE, {
        roleId: permissionEntity.id,
        menuIds: menuIds.join(","),
      });
      app.hideLoading();
      if (res.status == 0) {
        app.showToast(res.message);
        this.permissionEntity = {};
      }
    },
    onItemClearPermissionsClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要清空该角色菜单？",
        onOk: async () => {
          app.showLoading();
          let res = await app.postAsync(URLS.SUPER_ROLE_MENU_SAVE, {
            roleId: item.id,
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
        params.name = nameLike;
      }
      if (!utils.isEmpty(sortField)) {
        params.orderField = sortField;
        params.orderType =
          sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
      }
      let res = await app.postAsync(URLS.SUPER_ROLE_LIST, params);
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
