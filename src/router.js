import {
  createRouter,
  createWebHashHistory
} from "vue-router"
const routes = [{
  path: "/login",
  name: "login",
  component: () => import("./views/login/login.vue")
},
{
  path: "/",
  name: "page",
  component: () => import("./views/layout"),
  children: [{
    path: "",
    redirect: "/login"
  },
  {
    path: "/print/index",
    name: "print-index",
    meta: {
      icon: "ri-node-tree",
      title: "出货单据打印系统",
    },
    component: () => import("./views/pages/print/index.vue")
  },
  {
    path: "admin/departmentList",
    name: "adminDepartmentList",
    meta: {
      icon: "ri-node-tree",
      title: "部门列表",
    },
    component: () => import("./views/admin/departmentList.vue")
  },
  {
    path: "admin/userList",
    name: "adminUserList",
    meta: {
      icon: "ri-user-settings-line",
      title: "用户管理",
    },
    component: () => import("./views/admin/userList.vue")
  },
  {
    path: "superadmin/departmentList",
    name: "superAdminDepartmentList",
    meta: {
      icon: "ri-node-tree",
      title: "部门列表",
    },
    component: () => import("./views/superAdmin/departmentList.vue")
  },
  {
    path: "superadmin/menuList",
    name: "superAdminMenuList",
    meta: {
      icon: "ri-list-settings-line",
      title: "菜单管理",
    },
    component: () => import("./views/superAdmin/menuList.vue")
  },
  {
    path: "superadmin/params",
    name: "superAdminParams",
    meta: {
      icon: "ri-equalizer-line",
      title: "参数管理",
    },
    component: () => import("./views/superAdmin/params.vue")
  },
  {
    path: "superadmin/roleList",
    name: "superAdminRoleList",
    meta: {
      icon: "ri-team-line",
      title: "角色管理",
    },
    component: () => import("./views/superAdmin/roleList.vue")
  },
  {
    path: "superadmin/userList",
    name: "superAdminUserList",
    meta: {
      icon: "ri-user-settings-line",
      title: "用户管理",
    },
    component: () => import("./views/superAdmin/userList.vue")
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/login'
  }]
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router