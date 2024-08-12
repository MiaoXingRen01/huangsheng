const arrayPush = (ary, t) => {
  if (!ary.includes(t)) {
    ary.push(t);
  }
};
const arrayRemove = (ary, t) => {
  const index = ary.indexOf(t);
  if (index > -1) {
    ary.splice(index, 1);
  }
};
export const isAllChildrenSelected = (
  treeData,
  checkedIdList,
  replaceFields = { id: 'id', children: 'children' }
) => {
  for (let i = 0; i < treeData.length; i += 1) {
    const item = treeData[i];
    const children = item[replaceFields.children];
    const id = item[replaceFields.id];
    if (!checkedIdList.includes(id)) {
      return false;
    }
    if (children && children.length > 0) {
      if (!isAllChildrenSelected(children, checkedIdList, replaceFields)) {
        return false;
      }
    }
  }
  return true;
};

const getHalfChecked = (
  treeData,
  checkedIdList,
  replaceFields = { id: 'id', children: 'children' }
) => {
  const halfChecked = [];
  for (let i = 0; i < treeData.length; i += 1) {
    const item = treeData[i];
    const itemId = item[replaceFields.id];
    const children = item[replaceFields.children];
    if (children && children.length > 0) {
      const half = getHalfChecked(children, checkedIdList, replaceFields);
      half.forEach((t) => arrayPush(halfChecked, t));
      const selectCnt = children.filter((t) =>
        checkedIdList.includes(t[replaceFields.id])
      ).length;
      const halfSelectCnt = children.filter((t) =>
        halfChecked.includes(t[replaceFields.id])
      ).length;
      if (selectCnt > 0 && selectCnt < children.length) {
        arrayRemove(checkedIdList, itemId);
        halfChecked.push(itemId);
      } else if (halfSelectCnt > 0) {
        arrayRemove(checkedIdList, itemId);
        halfChecked.push(itemId);
      } else if (selectCnt == children.length) {
        arrayPush(checkedIdList, itemId);
      }
    }
  }
  return halfChecked;
};
export const getCheckedKeys = (
  treeData,
  checkedIdList,
  replaceFields = { id: 'id', children: 'children' }
) => {
  const halfChecked = getHalfChecked(treeData, checkedIdList, replaceFields);
  return {
    checked: checkedIdList,
    halfChecked,
  };
};
export const getChildrenIds = (
  treeData,
  replaceFields = { id: 'id', children: 'children' }
) => {
  const ids = [];
  for (let i = 0; i < treeData.length; i += 1) {
    const item = treeData[i];
    arrayPush(ids, item[replaceFields.id]);
    const children = item[replaceFields.children];
    if (children && children.length > 0) {
      getChildrenIds(children, replaceFields).forEach((t) => arrayPush(ids, t));
    }
  }
  return ids;
};

export const onTreeCheckChanged = (
  treeData,
  { halfChecked = [], checked = [] },
  treeNode,
  replaceFields = { id: 'id', children: 'children' }
) => {
  const treeNodeId = treeNode[replaceFields.id];
  if (checked.includes(treeNodeId)) {
    arrayRemove(checked, treeNodeId);
  } else {
    arrayPush(checked, treeNodeId);
  }
  const isChecked = checked.includes(treeNodeId);
  const children = treeNode[replaceFields.children] || [];
  if (isChecked) {
    arrayRemove(checked, treeNodeId);
    getChildrenIds(children, replaceFields).forEach((t) =>
      arrayRemove(checked, t)
    );
  } else {
    arrayRemove(halfChecked, treeNodeId);
    arrayPush(checked, treeNodeId);
    getChildrenIds(children, replaceFields).forEach((t) =>
      arrayPush(checked, t)
    );
  }
  return getCheckedKeys(treeData, checked, replaceFields);
};
