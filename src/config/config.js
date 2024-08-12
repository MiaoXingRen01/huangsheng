// const ENVIRONMENT = 'production';
const ENVIRONMENT = 'production';
let ROOT = "", ROOT_H5 = "";
if (ENVIRONMENT == 'production') {
  ROOT = "https://abc";
  ROOT_H5 = ""
} else if (ENVIRONMENT == 'local') {
  ROOT = 'http://192.168.1.209:52001/print';
  ROOT_H5 = '';
}
const ROOT_IMAGE = ROOT + '/static';
export const KEYS = {
  TOKEN: 'print-token',
  USER_INFO: 'userInfo',
  MENU_LIST: 'menuList',
  SELECT_MENU_LIST: 'selectMenuList',
}
export const DEFAULT = {
  LOGIN_TYPE: 'web',
  LIMIT: 15,
  MAX_LIMIT: 99999999,
  PAGE_SIZE_OPTIONS: ['15', '20', '25', '30'],
  VERSION_NAME: '1.0.0',
  MAP_CENTER: { lng: 117.997796, lat: 36.826897 },
  CONTENT_TYPE: "application/json"
}
export class URLEntity {
  constructor(url, contentType) {
    this.url = url
    this.contentType = contentType
  }
  toString() {
    return this.url
  }
}
export const URLS = {
  ROOT: `${ROOT}/`,
  ROOT_IMAGE: `${ROOT_IMAGE}/`,
  ADMIN_DEPARTMENT_DEL: new URLEntity(`${ROOT}/system/admin/department/delete`),//部门管理-删除
  ADMIN_DEPARTMENT_LIST: new URLEntity(`${ROOT}/system/admin/department/list`),//部门管理-列表
  ADMIN_DEPARTMENT_SAVE: new URLEntity(`${ROOT}/system/admin/department/save`),//部门管理-保存
  ADMIN_DEPARTMENT_TREE_LIST: new URLEntity(`${ROOT}/system/admin/department/tree`),//部门管理-树菜单
  ADMIN_USER_DEL: new URLEntity(`${ROOT}/system/admin/user/delete`), // 用户管理-删除用户
  ADMIN_USER_ENABLE: new URLEntity(`${ROOT}/system/admin/user/setEnable`), // 用户管理-启用/禁用
  ADMIN_USER_LIST: new URLEntity(`${ROOT}/system/admin/user/list`), // 用户管理-查询用户
  ADMIN_USER_RESETPWD: new URLEntity(`${ROOT}/system/admin/user/resetPwd`), // 用户管理-重置密码
  ADMIN_USER_SAVE: new URLEntity(`${ROOT}/system/admin/user/save`), // 用户管理-保存用户
  FILE_UPLOAD: new URLEntity(`${ROOT}/common/file/upload`, "multipart/form-data"), // 文件上传
  FORCE_USER_LOGOUT: new URLEntity(`${ROOT}/system/user/force-logout`), // 强制用户下线
  LOGIN: new URLEntity(`${ROOT}/authc/login`), // 登录
  LOGIN_LOG_LIST: new URLEntity(`${ROOT}/system/logs/login/list`),//登录日志
  LOGOUT: new URLEntity(`${ROOT}/authc/logout`), // 退出登录
  MENU_DEL: new URLEntity(`${ROOT}/system/menu/delete`), //删除菜单
  MENU_LIST: new URLEntity(`${ROOT}/system/menu/list`), //菜单列表
  MENU_SAVE: new URLEntity(`${ROOT}/system/menu/save`), //添加菜单
  MENU_TREE_LIST: new URLEntity(`${ROOT}/system/menu/tree`), //菜单树形结构列表
  PARAM_DEL: new URLEntity(`${ROOT}/system/param/delete`), //删除参数
  PARAM_DETAIL: new URLEntity(`${ROOT}/common/getParamByCode`), //获取参数详情
  PARAM_LIST: new URLEntity(`${ROOT}/system/param/list`), //参数列表
  PARAM_SAVE: new URLEntity(`${ROOT}/system/param/save`), //保存参数
  PARAMS_DESC_DEL: new URLEntity(`${ROOT}/system/param/desc/delete`),//删除参数明细
  PARAMS_DESC_LIST: new URLEntity(`${ROOT}/system/param/desc/list`),//参数明细
  PARAMS_DESC_SAVE: new URLEntity(`${ROOT}/system/param/desc/save`),//保存参数明细
  SUPER_DEPARTMENT_DEL: new URLEntity(`${ROOT}/system/department/delete`),//部门管理-删除
  SUPER_DEPARTMENT_LIST: new URLEntity(`${ROOT}/system/department/list`),//部门管理-列表
  SUPER_DEPARTMENT_SAVE: new URLEntity(`${ROOT}/system/department/save`),//部门管理-保存
  SUPER_DEPARTMENT_TREE_LIST: new URLEntity(`${ROOT}/system/department/tree`),//部门管理-树菜单
  SUPER_ROLE_DEL: new URLEntity(`${ROOT}/system/role/delete`), //角色删除
  SUPER_ROLE_LIST: new URLEntity(`${ROOT}/system/role/list`), // 用户管理-展示超级管理员角色列表
  SUPER_ROLE_MENU_LIST: new URLEntity(`${ROOT}/system/role/menu/list`), //包含超级管理员的角色菜单
  SUPER_ROLE_MENU_SAVE: new URLEntity(`${ROOT}/system/role/menu/set`), //角色菜单保存
  SUPER_ROLE_SAVE: new URLEntity(`${ROOT}/system/role/save`), //角色保存
  SUPER_USER_DEL: new URLEntity(`${ROOT}/system/user/delete`), // 用户管理-删除用户
  SUPER_USER_ENABLE: new URLEntity(`${ROOT}/system/user/setEnable`), // 用户管理-启用/禁用
  SUPER_USER_LIST: new URLEntity(`${ROOT}/system/user/list`), // 用户管理-查询用户
  SUPER_USER_RESETPWD: new URLEntity(`${ROOT}/system/user/resetPwd`), // 用户管理-重置密码
  SUPER_USER_SAVE: new URLEntity(`${ROOT}/system/user/save`), // 用户管理-保存用户
  USER_DEPARTMENT_TREE_LIST: new URLEntity(`${ROOT}/rights/user-depts`),//用户权限下的部门treeList
  USER_MENU_LIST: new URLEntity(`${ROOT}/authc/menus`), // 获取用户的菜单
  USER_PASSWORD_UPD: new URLEntity(`${ROOT}/authc/updPassword`), // 更新用户密码
  VERIFY_CODE: new URLEntity(`${ROOT}/verifyCode`, "multipart/form-data"), // 验证码
  VERIFY_CODE_TOKEN: new URLEntity(`${ROOT}/verifyCodeToken`), // 验证码Token


  // 出货单据打印系统
}