<template>
    <a-form :model="addFormData" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }" :rules="addFormRules" @finish="add">
        <a-form-item style="display: none" name="id">
            <a-input v-model:value="addFormData.id" />
        </a-form-item>
        <a-form-item style="display: none" name="paramCode">
            <a-input v-model:value="addFormData.paramCode" />
        </a-form-item>
        <a-form-item label="参数项编号" name="itemCode">
            <a-input placeholder="请输入参数项编号" v-model:value="addFormData.itemCode" autocomplete="off" />
        </a-form-item>
        <a-form-item label="名称" name="itemName">
            <a-input placeholder="请输入名称" v-model:value="addFormData.itemName" autocomplete="off" />
        </a-form-item>
        <a-form-item label="参数1" name="value1">
            <a-input placeholder="请输入参数1" v-model:value="addFormData.value1" autocomplete="off" />
        </a-form-item>
        <a-form-item label="参数2" name="value2">
            <a-input placeholder="请输入参数2" v-model:value="addFormData.value2" autocomplete="off" />
        </a-form-item>
        <a-form-item label="描述" name="description">
            <a-textarea placeholder="请输入描述" v-model:value="addFormData.description" autocomplete="off"></a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 6 }">
            <a-button type="primary" htmlType="submit" :loading="addLoading">
                提交
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import { ref, reactive, defineComponent } from "vue";
import { message } from "ant-design-vue";
import app from "../../app.js";
import { URLS } from "../../config/config.js";

const defaultAddFormData = {
  id: "",
  paramCode: "",
  itemCode: "",
  itemName: "",
  value1: "",
  value2: "",
  description: "",
};
const addFormRules = {
  itemCode: [{ required: true, message: "请输入参数项编号", trigger: "blur" }],
  itemName: [{ required: true, message: "请输入名称", trigger: "blur" }],
};
export default defineComponent({
  name: "addParamsModal",
  emits: {
    hideAddParamsDictModal: () => true,
  },
  setup(props, content) {
    const addFormData = reactive({ ...defaultAddFormData });
    const addLoading = ref(false);

    const add = async () => {
      let { id, ...submitData } = { ...addFormData };
      if (id) submitData.id = id;
      try {
        addLoading.value = true;
        let { status } = await paramsDictSave(submitData);
        addLoading.value = false;
        // 关闭父页面modal
        if (!status) {
          message.success(`${submitData.id ? "修改" : "添加"}成功`);
          content.emit("hideAddParamsDictModal", false);
        }
      } catch (e) {
        throw new Error(e);
      }
    };

    // 编辑接收数据
    const setDataForUpdate = (data) => {
      Object.keys(defaultAddFormData).map((i) => {
        if (i === "itemCode") addFormData.itemCode = data["item_code"];
        if (i === "itemName") addFormData.itemName = data["item_name"];
        if (data[i]) addFormData[i] = data[i];
      });
    };

    const paramsDictSave = (data) => app.postAsync(URLS.PARAMS_DESC_SAVE, data);
    return {
      addFormRules,
      addFormData,
      addLoading,

      add,
      setDataForUpdate,
    };
  },
});
</script>