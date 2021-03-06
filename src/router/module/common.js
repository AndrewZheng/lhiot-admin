import Main from '@/components/main';

const commonRouter = [
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '组件'
    },
    component: Main,
    children: [{
      path: 'count_to_page',
      name: 'count_to_page',
      meta: {
        icon: 'md-trending-up',
        title: '数字渐变'
      },
      component: () => import('@/view/basic-manager/components/count-to/count-to.vue')
    },
    {
      path: 'drag_list_page',
      name: 'drag_list_page',
      meta: {
        icon: 'ios-infinite',
        title: '拖拽列表'
      },
      component: () => import('@/view/basic-manager/components/drag-list/drag-list.vue')
    },
    {
      path: 'tables_page',
      name: 'tables_page',
      meta: {
        icon: 'md-grid',
        title: '多功能表格'
      },
      component: () => import('@/view/basic-manager/components/tables/tables.vue')
    },
    {
      path: 'split_pane_page',
      name: 'split_pane_page',
      meta: {
        icon: 'md-pause',
        title: '分割窗口'
      },
      component: () => import('@/view/basic-manager/components/split-pane/split-pane.vue')
    },
    {
      path: 'markdown_page',
      name: 'markdown_page',
      meta: {
        icon: 'logo-markdown',
        title: 'Markdown编辑器'
      },
      component: () => import('@/view/basic-manager/components/markdown/markdown.vue')
    },
    {
      path: 'editor_page',
      name: 'editor_page',
      meta: {
        icon: 'ios-create',
        title: '富文本编辑器'
      },
      component: () => import('@/view/basic-manager/components/editor/editor.vue')
    },
    {
      path: 'tinymce_editor_page',
      name: 'tinymce_editor_page',
      meta: {
        icon: 'ios-create',
        title: 'Tinymce编辑器'
      },
      component: () => import('@/view/basic-manager/components/tinymce-editor/tinymce-editor.vue')
    },
    {
      path: 'icons_page',
      name: 'icons_page',
      meta: {
        icon: '_bear',
        title: '自定义图标'
      },
      component: () =>
        import('@/view/basic-manager/components/icons/icons.vue')
    }
    ]
  },
  {
    path: '/excel',
    name: 'excel',
    meta: {
      icon: 'ios-stats',
      title: 'EXCEL导入导出'
    },
    component: Main,
    children: [{
      path: 'upload-excel',
      name: 'upload-excel',
      meta: {
        icon: 'md-add',
        title: '导入EXCEL'
      },
      component: () => import('@/view/basic-manager/excel/upload-excel.vue')
    },
    {
      path: 'export-excel',
      name: 'export-excel',
      meta: {
        icon: 'md-download',
        title: '导出EXCEL'
      },
      component: () => import('@/view/basic-manager/excel/export-excel.vue')
    }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'ios-settings',
      title: '系统管理'
    },
    component: Main,
    children: [{
      path: 'menu',
      name: 'menu',
      meta: {
        icon: 'md-menu',
        title: '菜单管理'
      },
      component: () => import('@/view/basic-manager/system/menu/menu.vue')
    },
    // {
    //   path: 'config',
    //   name: 'config',
    //   meta: {
    //     icon: 'md-barcode',
    //     title: '参数管理'
    //   },
    //   component: () => import('@/view/system/config/config.vue')
    // },
    // {
    //   path: 'permission',
    //   name: 'permission',
    //   meta: {
    //     icon: 'md-build',
    //     title: '权限管理'
    //   },
    //   component: () => import('@/view/basic-manager/system/permission/permission.vue')
    // },
    {
      path: 'role',
      name: 'role',
      meta: {
        icon: 'md-people',
        title: '角色管理'
      },
      component: () => import('@/view/basic-manager/system/role/role.vue')
    },
    {
      path: 'user',
      name: 'user',
      meta: {
        icon: 'md-person',
        title: '用户管理'
      },
      component: () => import('@/view/basic-manager/system/user/user.vue')
    }
    ]
  },
  {
    path: '/dictionary-manager',
    name: 'dictionary-manager',
    meta: {
      icon: 'md-bookmarks',
      title: '数据字典管理'
    },
    component: Main,
    children: [{
      path: '/dictionary',
      name: 'dictionary',
      meta: {
        icon: 'ios-book',
        title: '数据字典'
      },
      component: () => import('@/view/basic-manager/dictionary/dictionary.vue')
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }]

export default commonRouter;
