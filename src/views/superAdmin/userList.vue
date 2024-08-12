<template>
    <div :id="$route.name">
        <a-card>
            <template #title>
                <a-row justify="space-between" align="top">
                    <a-form layout="inline">
                        <a-form-item>
                            <a-input placeholder="账号/姓名/手机号" v-model:value="searchText" style="width: 180px" allowClear/>
                        </a-form-item>
                        <a-form-item >
                            <a-select placeholder="角色" v-model:value="searchRoleId" style="width: 180px" allowClear>
                                <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item>
                            <a-select placeholder="状态" v-model:value="searchStatus" style="width: 180px" allowClear>
                                <a-select-option value="1">正常</a-select-option>
                                <a-select-option value="2">冻结</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item>
                            <a-select placeholder="是否删除" v-model:value="searchDelFlag" style="width: 180px" allowClear>
                                <a-select-option value="y">是</a-select-option>
                                <a-select-option value="n">否</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" @click.prevent="onSearchClick">查询</a-button>
                            <a-button type="link" @click.prevent="onResetClick">重置</a-button>
                        </a-form-item>
                    </a-form>
                    <a-space>
                        <a-button type="primary" @click.prevent="onItemEditClick()">
                            <i class="ri-add-line"></i>
                            <span>添加用户</span>
                        </a-button>
                    </a-space>
                </a-row>
            </template>


            <a-table :columns="defaultColumns" @change="handleTableChange" :data-source="pagination.data" :pagination="pagination" :rowKey="t => t.id" :scroll="{ x: 1000 }" bordered>
                <template #bodyCell="{ column, record:item }">			
					<template v-if="column.key=='state'">
						<a-tag v-if="item.delFlag=='n'" :color="statusUtil.getUserStateColor(item.status)">{{ statusUtil.getUserStateText(item.status) }}</a-tag>
						<a-tag v-else color="red">已删除</a-tag>
					</template>
                    <template v-else-if="column.key=='action'">
                        <a href="javascript:;" @click.prevent="onItemShowClick(item)">查看</a>
                        <a-divider type="vertical" />
                        <a href="javascript:;" @click.prevent="onItemEditClick(item)">编辑</a>
                        <template v-if="item.delFlag=='n'">
                            <a-divider type="vertical" />
                            <a href="javascript:;" @click.prevent="onItemDeleteClick(item)">删除</a>
                        </template>
                        <a-divider type="vertical" />
                        <a href="javascript:;" v-if="item.status==1" @click.prevent="onItemSatusClick(item,2)">冻结</a>
                        <a href="javascript:;" v-if="item.status==2" @click.prevent="onItemSatusClick(item,1)">解冻</a>
                        <a-divider type="vertical" />
                        <a href="javascript:;" @click.prevent="onItemResetPasswordClick(item)">重置密码</a>
                        <a-divider type="vertical" />
                        <a href="javascript:;" @click.prevent="onItemForceLogoutClick(item)">强制下线</a>

                    </template>
                </template>
            </a-table>
        </a-card>

        <a-modal v-model:visible="showAddUserModal" title="用户信息" width="600px" centered @cancel="editEntity={}" @ok="onSubmitEditEntityClick">
            <a-form :labelCol="{ span: 7 }" :wrapperCol="{  span: 13 }">
                <a-form-item label="登录账号" required>
                    <a-input placeholder="请输入" v-model:value="editEntity.account" :disabled="editEntity.readonly" />
                </a-form-item>
                <a-form-item label="角色" required>
                    <a-select placeholder="请选择" v-model:value="editEntity.roleId" :disabled="editEntity.readonly">
                        <a-select-option v-for="item in roleList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="姓名" required>
                    <a-input placeholder="请输入" v-model:value="editEntity.name" :disabled="editEntity.readonly" />
                </a-form-item>
                <a-form-item label="头像">
                    <a-upload list-type="picture" name="file" :multiple="false" @preview="onPreviewClick" :fileList="convert2FileList('editEntity','header','headerPicType')" :beforeUpload="file=>onFileChanged('editEntity','header',file)" @remove="()=>editEntity.header=''">
                        <a-button icon="upload">上传</a-button>
                    </a-upload>
                </a-form-item>
                <a-form-item label="性别">
                    <a-radio-group name="radioGroup" v-model:value="editEntity.sex" :disabled="editEntity.readonly">
                        <a-radio value="1">男</a-radio>
                        <a-radio value="0">女</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="手机号">
                    <a-input placeholder="请输入" v-model:value="editEntity.phone" :disabled="editEntity.readonly" />
                </a-form-item>
                <a-form-item label="身份证号">
                    <a-input placeholder="请输入" v-model:value="editEntity.idcardNo" :disabled="editEntity.readonly" />
                </a-form-item>
                <a-form-item label="所属部门">
                    <a-tree-select placeholder="请输入" v-model:value="editEntity.deptIds" :tree-data="departmentTreeList" :fieldNames="{key:'id',label:'name',value:'id'}" />
                </a-form-item>
            </a-form>
        </a-modal>
        <viewer :visible="!!largeImagePath" @onClose="largeImagePath=''" :src="largeImagePath" />
    </div>
</template>

<script>
import app from "../../app.js";
import utils from "../../config/utils.js";
import statusUtil from "../../config/statusUtil.js";
import { DEFAULT, URLS } from "../../config/config.js";
export default {
  data() {
    return {
      sortField: "",
      sortOrder: "",
      editEntity: {},
      showAddUserModal: false,
      statusUtil,
      accountLike: "",
      searchText: "",
      searchRoleId: null,
      searchStatus: null,
      searchDelFlag: null,
      roleList: [],
      largeImagePath: "",
      departmentTreeList: [],
      permissionEntity: { checkedPermissionList: [] },
      defaultColumns: [
        { title: "账号", dataIndex: "account" },
        { title: "姓名", dataIndex: "name" },
        { title: "角色", dataIndex: "roleName" },
        { title: "手机号", dataIndex: "phone" },
        { title: "状态", key: "state" },
        { title: "更新时间", dataIndex: "updTime" },
        { title: "最后活跃时间", dataIndex: "activeTime" },
        { title: "所属部门", dataIndex: "deptNames" },
        { title: "操作", key: "action", width: 360 },
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
    const res = await app.postAsync(URLS.SUPER_ROLE_LIST, {
      page: 1,
      limit: DEFAULT.MAX_LIMIT,
    });
    if (res.status == 0) {
      this.roleList = res.data.data;
    }

    const res2 = await app.postAsync(URLS.SUPER_DEPARTMENT_TREE_LIST);
    if (res2.status == 0) {
      this.departmentTreeList = res2.data;
    }
    this.requestData(true);
  },
  methods: {
    onFileChanged(objName, key, file) {
      this[objName][key] = file;
      return false;
    },
    convert2FileList(entityKey, key, typeKey) {
      let entity = this[entityKey];
      let obj = entity[key];
      if (obj) {
        if (typeof obj == "string") {
          if (utils.isBase64(obj)) {
            entity[typeKey] = "base64";
            return [
              {
                uid: Math.random() * -1,
                url: obj,
                name: " ",
              },
            ];
          } else {
            entity[typeKey] = "";
            let split = obj.split("/");
            return [
              {
                uid: Math.random() * -1,
                url: utils.isHttp(obj) ? obj : `${URLS.ROOT_IMAGE}${obj}`,
                name: " ", //split[split.length - 1],
              },
            ];
          }
        } else {
          entity[typeKey] = "";
          if (!obj.url) {
            obj.url = window.URL
              ? window.URL.createObjectURL(obj)
              : window.webkitURL.createObjectURL(obj);
          }
          return [obj];
        }
      } else {
        return [];
      }
    },
    onPreviewClick(e) {
      if (!utils.isEmpty(e.url)) {
        if (/^data:image/.test(e.url)) {
          const img = new Image();
          img.src = e.url;
          const newWin = window.open("", "_blank");
          newWin.document.write(img.outerHTML);
          newWin.document.close();
        } else {
          window.open(e.url);
        }
      }
    },
    onSelectAllClick() {
      let checkedPermissionList = [];
      let fun = (list) => {
        list.forEach((t) => {
          if (t.uniPlatformUrls && t.uniPlatformUrls.length > 0) {
            fun(t.uniPlatformUrls);
          } else {
            checkedPermissionList.push(t.id);
          }
        });
      };
      fun(this.permissionEntity.permissionList);
      this.permissionEntity.checkedPermissionList = checkedPermissionList;
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.sortField = sorter.field;
      this.sortOrder = sorter.order;
      this.requestData(true);
    },
    async onSubmitEditEntityClick() {
      const { editEntity } = this;
      console.log(editEntity);
      if (editEntity.readonly) {
        this.showAddUserModal = false;
        this.editEntity = {};
        return;
      }
      const params = {};
      if (!utils.isEmpty(editEntity.userId)) {
        params.id = editEntity.userId;
      }
      if (!utils.isEmpty(editEntity.sex)) {
        params.sex = editEntity.sex;
      }
      if (!utils.isEmpty(editEntity.phone)) {
        params.phone = editEntity.phone;
      }
      if (!utils.isEmpty(editEntity.idcardNo)) {
        params.idcardNo = editEntity.idcardNo;
      }
      if (!utils.isEmpty(editEntity.deptIds)) {
        params.deptIds = editEntity.deptIds;
      }
      if (utils.isEmpty(editEntity.account)) {
        app.showToast("请输入登录账号");
        return;
      }
      params.account = (editEntity.account + "").trim();
      if (utils.isEmpty(editEntity.name)) {
        app.showToast("请输入姓名");
        return;
      }
      params.name = (editEntity.name + "").trim();
      if (utils.isEmpty(editEntity.roleId)) {
        app.showToast("请选择角色");
        return;
      }
      params.roleId = editEntity.roleId;
      if (editEntity.header instanceof File) {
        const compressFile = await utils.compressFile(editEntity.header);
        const res = await app.uploadAsync(
          URLS.FILE_UPLOAD,
          compressFile != null ? compressFile : editEntity.header
        );
        if (res.status == 0) {
          params.header = res.data.newName;
        } else {
          app.showToast("上传头像出错");
          app.hideLoading();
          return;
        }
      } else {
        params.header = editEntity.header || "";
      }
      let res = await app.postAsync(URLS.SUPER_USER_SAVE, params);
      if (res.status == 0) {
        app.showToast(res.message);
        this.showAddUserModal = false;
        this.editEntity = {};
        this.onSearchClick();
      }
    },
    onItemShowClick(item) {
      this.showAddUserModal = true;
      this.editEntity = { ...item, readonly: true };
    },
    onItemEditClick(item = {}) {
      const editEntity = { ...item };
      this.editEntity = editEntity;
      this.showAddUserModal = true;
    },
    onItemDeleteClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要删除该用户吗？",
        onOk: async () => {
          app.showLoading();
          const res = await app.postAsync(URLS.SUPER_USER_DEL, {
            userId: item.userId,
          });
          app.hideLoading();
          if (res.status == 0) {
            app.showToast(res.message);
            this.onSearchClick();
          }
        },
      });
    },
    onItemForceLogoutClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要下线该用户吗？",
        onOk: async () => {
          app.showLoading();
          let res = await app.postAsync(URLS.FORCE_USER_LOGOUT, {
            userId: item.userId,
          });
          app.hideLoading();
          if (res.status == 0) {
            app.showToast(res.message);
          }
        },
      });
    },
    onItemSatusClick(item, status) {
      const params = { userId: item.userId };
      const content = status == 1 ? "确认解冻该用户？" : "确认冻结该用户？";
      params.operate = status == 1 ? "enable" : "disable";
      this.$confirm({
        title: "提示",
        content,
        onOk: async () => {
          app.showLoading();
          let res = await app.postAsync(URLS.SUPER_USER_ENABLE, params);
          app.hideLoading();
          app.showToast(res.message);
          if (res.status == 0) {
            this.onSearchClick();
          }
        },
      });
    },
    onItemResetPasswordClick(item) {
      this.$confirm({
        title: "提示",
        content: "确定要重置该用户密码为默认密码？",
        onOk: async () => {
          app.showLoading();
          let res = await app.postAsync(URLS.SUPER_USER_RESETPWD, {
            userId: item.userId,
          });
          app.hideLoading();
          if (res.status == 0) {
            app.showToast(res.message);
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
      this.searchText = this.searchRoleId = null;
      this.searchStatus = this.searchDelFlag = null;
      this.onSearchClick();
    },
    async requestData(showLoading = false) {
      let {
        searchText,
        searchRoleId,
        sortField,
        sortOrder,
        searchStatus,
        searchDelFlag,
      } = this;
      let pageEntity = this.pagination;
      if (showLoading) {
        app.showLoading();
      }
      const params = {
        page: pageEntity.current,
        limit: pageEntity.pageSize,
      };
      if (!utils.isEmpty(searchText)) {
        params.user = searchText;
      }
      if (!utils.isEmpty(searchRoleId)) {
        params.roleId = searchRoleId;
      }
      if (!utils.isEmpty(searchStatus)) {
        params.status = searchStatus;
      }
      if (!utils.isEmpty(sortField)) {
        params.orderField = sortField;
        params.orderType =
          sortOrder == "ascend" ? "asc" : sortOrder == "descend" ? "desc" : "";
      }
      params.delFlag = searchDelFlag;
      const res = await app.postAsync(URLS.SUPER_USER_LIST, params);
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
