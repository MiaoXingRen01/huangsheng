const userStateList = [
  {
    name1: '正常',
    value: 1,
    color: 'green',
  },
  {
    name1: '冻结',
    value: 2,
    color: 'red',
  },
];
function getEntityByValue(list, status) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].value == status) {
      return list[i];
    }
  }
  return {};
}

function getInfoByValue(list, status, key) {
  return getEntityByValue(list, status)[key];
}

function getName1ByValue(list, status) {
  return getInfoByValue(list, status, 'name1');
}

function getName3ByValue(list, status) {
  return getInfoByValue(list, status, 'name3');
}

function getColorByValue(list, status) {
  return getInfoByValue(list, status, 'color');
}

function getStyleByValue(list, status) {
  return getInfoByValue(list, status, 'style');
}

module.exports = {
  getName3ByValue: getName3ByValue,
  getUserStateText: (status) => getName1ByValue(userStateList, status),
  getUserStateColor: (status) => getColorByValue(userStateList, status),
};
