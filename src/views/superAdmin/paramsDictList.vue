<template>

    <a-card>
        <template #title>
            <a-space>
                <a-button type="primary" @click="handleParamsDictModal">
                    <i class="ri-menu-add-fill"></i>
                    <span>添加参数</span>
                </a-button>
            </a-space>
        </template>
        <a-row type="flex" :gutter="24">
            <a-col flex="auto">
                <a-table :columns="columns" :dataSource="dataSource" :rowKey="(record) => record.id" :pagination="false" :loading="loading">
                    <template v-for="col in columns.map(i=>i.isEdit&&i.dataIndex)" #[col]="{ text, record }" :key="col">
                        <div>
                            <a-input v-if="editableData[record['itemCode']]" v-model:value="editableData[record['itemCode']][col]" style="margin: -5px 0" />
                            <template v-else>
                                {{ text }}
                            </template>
                        </div>
                    </template>
                    <template #action="{ record }">
                        <template v-if="editableData[record['itemCode']]">
                            <a href="javascript:void(0)" @click="handleParamsDictSave(record['itemCode'])">保存</a>
                            <a-divider type="vertical" />
                            <a href="javascript:void(0)" @click="handleParamsDictCancel(record['itemCode'])">取消</a>
                        </template>
                        <template v-else>
                            <a href="javascript:void(0)" @click="handleParamsDictEdit(record['itemCode'])">编辑</a>
                            <a-divider type="vertical" />
                            <a-popconfirm title="确定要删除吗?" @confirm="handleParamsDictDelete(record)">
                                <a-typography-link type="danger" href="javascript:void(0)">删除</a-typography-link>
                            </a-popconfirm>
                        </template>
                    </template>
                </a-table>
            </a-col>
        </a-row>
    </a-card>
    <a-modal v-model:visible="addParamsDictModal" title="添加参数字典" :footer="null" destroyOnClose>
        <paramsDictAdd @hideAddParamsDictModal="handleAddParamsDictModal" ref="addParamsDictRef" />
    </a-modal>
</template>

<script>
import {
  onMounted,
  defineComponent,
  reactive,
  toRefs,
  ref,
  nextTick,
} from "vue";
import paramsDictAdd from "./paramsDictAdd.vue";
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import app from "../../app.js";
import { URLS } from "../../config/config.js";

const columns = [
  { dataIndex: "paramCode", title: "参数", width: 150, ellipsis: true },
  {
    dataIndex: "itemCode",
    title: "参数项编码",
    width: 150,
    ellipsis: true,
  },
  {
    dataIndex: "itemName",
    title: "参数名称",
    width: 150,
    ellipsis: true,
  },
  {
    dataIndex: "value1",
    slots: { customRender: "value1" },
    title: "参数1",
    width: 100,
    ellipsis: true,
    isEdit: true,
  },
  {
    dataIndex: "value2",
    slots: { customRender: "value2" },
    title: "参数2",
    width: 100,
    ellipsis: true,
    isEdit: true,
  },
  {
    dataIndex: "description",
    slots: { customRender: "description" },
    title: "描述",
    width: 150,
    ellipsis: true,
    isEdit: true,
  },
  { title: "操作", slots: { customRender: "action" }, width: 120 },
];
export default defineComponent({
  name: "",
  components: { paramsDictAdd },
  props: { code: String },
  setup(props) {
    const data = reactive({ columns, dataSource: [], loading: false });
    const addParamsDictRef = ref(null);
    const addParamsDictModal = ref(false);

    const query = async () => {
      let params = { page: 1, limit: 999, paramCode: props.code };
      try {
        let { data: resultData } = await getDictList(params);
        data.dataSource = resultData;
        data.loading = false;
      } catch (e) {
        data.dataSource = [];
        data.loading = true;
      }
    };

    const handleParamsDictModal = async (record) => {
      addParamsDictModal.value = true;
      await nextTick();
      addParamsDictRef.value.setDataForUpdate({
        paramCode: props["code"],
        ...record,
      });
    };

    const handleAddParamsDictModal = (bool) => {
      addParamsDictModal.value = bool;
      if (!bool) query();
    };
    const handleParamsDictDelete = async (record) => {
      let { status } = await app.postAsync(URLS.PARAMS_DESC_DEL, {
        descId: record.id,
      });
      if (!status) {
        message.success("删除成功");
        await query();
      }
    };

    // 修改
    const editableData = reactive({});
    const handleParamsDictEdit = (code) => {
      editableData[code] = cloneDeep(
        data.dataSource.filter((item) => code === item["itemCode"])[0]
      );
    };
    const handleParamsDictSave = async (code) => {
      let saveObg = { ...editableData[code] };
      Object.assign(
        data.dataSource.filter((item) => code === item["itemCode"])[0],
        editableData[code]
      );
      delete editableData[code];
      try {
        data.loading = true;
        let { status } = await paramsDictSave(saveObg);
        if (!status) {
          message.success(`${saveObg.id ? "修改" : "添加"}成功`);
          await query();
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        data.loading = false;
      }
    };
    const handleParamsDictCancel = (code) => {
      delete editableData[code];
    };

    onMounted(() => {
      query();
    });

    const getDictList = (data) => app.postAsync(URLS.PARAMS_DESC_LIST, data);
    const paramsDictSave = (data) => app.postAsync(URLS.PARAMS_DESC_SAVE, data);
    return {
      ...toRefs(data),
      addParamsDictModal,
      addParamsDictRef,

      handleParamsDictModal,
      handleAddParamsDictModal,
      handleParamsDictDelete,
      editableData,
      handleParamsDictEdit,
      handleParamsDictSave,
      handleParamsDictCancel,
    };
  },
});
</script>
<style lang="less" scoped></style>
