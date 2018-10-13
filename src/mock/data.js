import Mock from 'mockjs';
import {
  doCustomTimes,
  getParams
} from '@/libs/util';

const Random = Mock.Random;

export const getTableData = req => {
  let tableData = [];
  const {
    page = 1, rows = 10
  } = getParams(req.url);
  doCustomTimes(47, () => {
    tableData.push(Mock.mock({
      'id|1-47': 1,
      name: '@name',
      'age|18-40': 1,
      sex: Random.integer(0, 1),
      email: '@email',
      birth: Random.date(),
      createTime: '@date'
    }));
  });

  const pageList = tableData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': tableData.length
  };
};

export const getDragList = req => {
  let dragList = [];
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }));
  });
  return dragList;
};

export const getMenuData = req => {
  let tableData = [];
  const { page = 1, rows = 10, parentid } = getParams(req.url);
  const one=[{
    'id': 6,
    'parentid': 1,
    'code': 'home',
    'path': '/home',
    'sort': 1,
    'title': '首页',
    'meta': {
      'title': '首页',
      'icon': 'ios-home'
    },
    'type': 'SON'
  },
  {
    'id': 7,
    'parentid': 1,
    'sort': 2,
    'code': 'components',
    'path': '/components',
    'title': '组件',
    'meta': {
      'title': '组件',
      'icon': 'logo-buffer'
    },
    'type': 'PARENT'
  },
  {
    'id': 8,
    'parentid': 7,
    'sort': 3,
    'code': 'count_to_page',
    'path': 'count_to_page',
    'title': '数字渐变',
    'meta': {
      'title': '数字渐变',
      'icon': 'md-trending-up'
    },
    'type': 'SON'
  },
  {
    'id': 9,
    'parentid': 7,
    'sort': 4,
    'code': 'drag_list_page',
    'path': 'drag_list_page',
    'title': '拖拽列表',
    'meta': {
      'title': '拖拽列表',
      'icon': 'ios-infinite'
    },
    'type': 'SON'
  },
  {
    'id': 10,
    'parentid': 7,
    'sort': 5,
    'path': 'tables_page',
    'code': 'tables_page',
    'title': '多功能表格',
    'meta': {
      'title': '多功能表格',
      'icon': 'md-grid'
    },
    'type': 'SON'
  },
  {
    'id': 11,
    'parentid': 7,
    'sort': 6,
    'path': 'split_pane_page',
    'code': 'split_pane_page',
    'title': '分割窗口',
    'meta': {
      'title': '分割窗口',
      'icon': 'md-pause'
    },
    'type': 'SON'
  },
  {
    'id': 12,
    'parentid': 7,
    'sort': 7,
    'path': 'markdown_page',
    'code': 'markdown_page',
    'title': 'Markdown编辑器',
    'meta': {
      'icon': 'logo-markdown',
      'title': 'Markdown编辑器'
    },
    'type': 'SON'
  },
  {
    'id': 13,
    'parentid': 7,
    'sort': 8,
    'path': 'editor_page',
    'code': 'editor_page',
    'title': '富文本编辑器',
    'meta': {
      'icon': 'ios-create',
      'title': '富文本编辑器'
    },
    'type': 'SON'
  },
  {
    'id': 14,
    'parentid': 7,
    'sort': 9,
    'path': 'icons_page',
    'code': 'icons_page',
    'title': '自定义图标',
    'meta': {
      'icon': '_bear',
      'title': '自定义图标'
    },
    'type': 'SON'
  },
  {
    'id': 15,
    'parentid': 7,
    'sort': 10,
    'path': 'tinymce_editor_page',
    'code': 'tinymce_editor_page',
    'title': 'Tinymce编辑器',
    'meta': {
      'icon': 'ios-create',
      'title': 'Tinymce编辑器'
    },
    'type': 'SON'
  },
  {
    'id': 16,
    'parentid': 1,
    'sort': 11,
    'code': 'system',
    'path': '/system',
    'title': '系统管理',
    'meta': {
      'title': '系统管理',
      'icon': 'ios-settings'
    },
    'type': 'PARENT'
  },
  {
    'id': 17,
    'parentid': 16,
    'sort': 12,
    'code': 'menu',
    'path': 'menu',
    'title': '菜单管理',
    'meta': {
      'title': '菜单管理',
      'icon': 'ios-settings'
    },
    'type': 'SON'
  },
  {
    'id': 18,
    'parentid': 16,
    'sort': 13,
    'code': 'config',
    'path': 'config',
    'title': '参数管理',
    'meta': {
      'title': '参数管理',
      'icon': 'md-settings'
    },
    'type': 'SON'
  },
  {
    'id': 19,
    'parentid': 16,
    'sort': 14,
    'code': 'permission',
    'path': 'permission',
    'title': '权限管理',
    'meta': {
      'title': '权限管理',
      'icon': 'md-lock'
    },
    'type': 'SON'
  },
  {
    'id': 20,
    'parentid': 16,
    'sort': 15,
    'code': 'role',
    'path': 'role',
    'title': '角色管理',
    'meta': {
      'title': '角色管理',
      'icon': 'ios-people'
    },
    'type': 'SON'
  },
  {
    'id': 25,
    'parentid': 16,
    'sort': 20,
    'code': 'user',
    'path': 'user',
    'title': '用户管理',
    'meta': {
      'title': '用户管理',
      'icon': 'md-person'
    },
    'type': 'SON'
  }];
  
  const two=[{
    'id': 21,
    'parentid': 2,
    'sort': 16,
    'code': 'doc',
    'path': '',
    'title': '文档',
    'meta': {
      'title': '文档',
      'icon': 'ios-book',
      'href': 'https://lison16.github.io/iview-admin-doc/#/'
    },
    'type': 'SON'
  }];

  const three=[{
    'id': 22,
    'parentid': 3,
    'sort': 17,
    'path': '/excel',
    'code': 'excel',
    'title': 'EXCEL导入导出',
    'meta': {
      'icon': 'ios-stats',
      'title': 'EXCEL导入导出'
    },
    'type': 'SON'
  }];

  const four=[{
    'id': 23,
    'parentid': 4,
    'sort': 18,
    'path': 'upload-excel',
    'code': 'upload-excel',
    title: '导入EXCEL',
    'meta': {
      icon: 'md-add',
      title: '导入EXCEL'
    },
    'type': 'SON'
  }];

  const five=[{
    'id': 24,
    'parentid': 5,
    'sort': 19,
    'path': 'export-excel',
    'code': 'export-excel',
    title: '导出EXCEL',
    'meta': {
      icon: 'md-download',
      title: '导出EXCEL'
    },
    'type': 'SON'
  }];
  
  const seven=[{
    'id': 7,
    'parentid': 1,
    'sort': 2,
    'code': 'components',
    'path': '/components',
    'title': '组件',
    'meta': {
      'title': '组件',
      'icon': 'logo-buffer'
    },
    'type': 'PARENT'
  },
  {
    'id': 8,
    'parentid': 7,
    'sort': 3,
    'code': 'count_to_page',
    'path': 'count_to_page',
    'title': '数字渐变',
    'meta': {
      'title': '数字渐变',
      'icon': 'md-trending-up'
    },
    'type': 'SON'
  },
  {
    'id': 9,
    'parentid': 7,
    'sort': 4,
    'code': 'drag_list_page',
    'path': 'drag_list_page',
    'title': '拖拽列表',
    'meta': {
      'title': '拖拽列表',
      'icon': 'ios-infinite'
    },
    'type': 'SON'
  },
  {
    'id': 10,
    'parentid': 7,
    'sort': 5,
    'path': 'tables_page',
    'code': 'tables_page',
    'title': '多功能表格',
    'meta': {
      'title': '多功能表格',
      'icon': 'md-grid'
    },
    'type': 'SON'
  },
  {
    'id': 11,
    'parentid': 7,
    'sort': 6,
    'path': 'split_pane_page',
    'code': 'split_pane_page',
    'title': '分割窗口',
    'meta': {
      'title': '分割窗口',
      'icon': 'md-pause'
    },
    'type': 'SON'
  },
  {
    'id': 12,
    'parentid': 7,
    'sort': 7,
    'path': 'markdown_page',
    'code': 'markdown_page',
    'title': 'Markdown编辑器',
    'meta': {
      'icon': 'logo-markdown',
      'title': 'Markdown编辑器'
    },
    'type': 'SON'
  },
  {
    'id': 13,
    'parentid': 7,
    'sort': 8,
    'path': 'editor_page',
    'code': 'editor_page',
    'title': '富文本编辑器',
    'meta': {
      'icon': 'ios-create',
      'title': '富文本编辑器'
    },
    'type': 'SON'
  },
  {
    'id': 14,
    'parentid': 7,
    'sort': 9,
    'path': 'icons_page',
    'code': 'icons_page',
    'title': '自定义图标',
    'meta': {
      'icon': '_bear',
      'title': '自定义图标'
    },
    'type': 'SON'
  },
  {
    'id': 15,
    'parentid': 7,
    'sort': 10,
    'path': 'tinymce_editor_page',
    'code': 'tinymce_editor_page',
    'title': 'Tinymce编辑器',
    'meta': {
      'icon': 'ios-create',
      'title': 'Tinymce编辑器'
    },
    'type': 'SON'
  }];
  
  const sixteen=[{
    'id': 16,
    'parentid': 1,
    'sort': 11,
    'code': 'system',
    'path': '/system',
    'title': '系统管理',
    'meta': {
      'title': '系统管理',
      'icon': 'ios-settings'
    },
    'type': 'PARENT'
  },
  {
    'id': 17,
    'parentid': 16,
    'sort': 12,
    'code': 'menu',
    'path': 'menu',
    'title': '菜单管理',
    'meta': {
      'title': '菜单管理',
      'icon': 'ios-settings'
    },
    'type': 'SON'
  },
  {
    'id': 18,
    'parentid': 16,
    'sort': 13,
    'code': 'config',
    'path': 'config',
    'title': '参数管理',
    'meta': {
      'title': '参数管理',
      'icon': 'md-settings'
    },
    'type': 'SON'
  },
  {
    'id': 19,
    'parentid': 16,
    'sort': 14,
    'code': 'permission',
    'path': 'permission',
    'title': '权限管理',
    'meta': {
      'title': '权限管理',
      'icon': 'md-lock'
    },
    'type': 'SON'
  },
  {
    'id': 20,
    'parentid': 16,
    'sort': 15,
    'code': 'role',
    'path': 'role',
    'title': '角色管理',
    'meta': {
      'title': '角色管理',
      'icon': 'ios-people'
    },
    'type': 'SON'
  },
  {
    'id': 25,
    'parentid': 16,
    'sort': 20,
    'code': 'user',
    'path': 'user',
    'title': '用户管理',
    'meta': {
      'title': '用户管理',
      'icon': 'md-person'
    },
    'type': 'SON'
  }];

  switch (parentid) {
    case '1':
    tableData.push(...one);
    break;
    case '2':
    tableData.push(...two);
    break;
    case '3':
    tableData.push(...three);
    break;
    case '4':
    tableData.push(...four);
    break;
    case '5':
    tableData.push(...five);
    break;
    case '7':
    tableData.push(...seven);
    break;
    case '16':
    tableData.push(...sixteen);
    break;
  }

  const pageList = tableData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': tableData.length
  };
};

export const getRoleData = req => {
  let roleData = [];
  const {
    page = 1, rows = 10
  } = getParams(req.url);
  doCustomTimes(15, () => {
    roleData.push(Mock.mock({
      'id|1-47': 1,
      name: '@name',
      status: Random.integer(0, 1),
      roleDesc: Random.csentence(10, 13),
      createBy: '@name',
      createAt: '@now'
    }));
  });
  const pageList = roleData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': roleData.length
  };
};

export const getUserData = req => {
  let userData = [];
  const {
    page = 1, rows = 10
  } = getParams(req.url);
  doCustomTimes(15, () => {
    userData.push(Mock.mock({
      'id|1-47': 1,
      name: '@name',
      account: '@name',
      tel: Random.integer(13100000000, 19999999999),
      avatarUrl: '@image',
      status: Random.integer(0, 1),
      createAt: '@now',
      lastLoginAt: '@now',
      remark: Random.csentence(1, 5)
    }));
  });
  const pageList = userData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': userData.length
  };
};

export const getOperateData = req => {
  let tableData = [];
  const { page = 1, rows = 10, menuId= 0 } = getParams(req.url);
  const data=[{
    'id': 1,
    'type': 'get,post',
    'menuId': 0,
    'name': '菜单操作限制',
    'antUrl': '/**/ims-menu/**'
  },
  {
    'id': 2,
    'type': 'get',
    'menuId': 0,
    'name': '菜单获取限制',
    'antUrl': '/ims-menu/{id}'
  },
  {
    'id': 3,
    'type': 'post',
    'menuId': 0,
    'name': '菜单添加限制',
    'antUrl': '/ims-menu/create'
  }];

  const data2=[{
    'id': 1,
    'type': 'get',
    'menuId': 6,
    'name': '首页获取数据限制',
    'antUrl': '/**/ims-home/**'
  }];

  const data3=[{
    'id': 1,
    'type': 'post',
    'menuId': 17,
    'name': '操作权限创建限制',
    'antUrl': '/ims-operation/create'
  },
  {
    'id': 2,
    'type': 'get',
    'menuId': 17,
    'name': '操作权限获取限制',
    'antUrl': '/ims-operation/{menuId}'
  }];

  switch (menuId) {
    case '6':
    tableData.push(...data2);
    break;
    case '17':
    tableData.push(...data3);
    break;
    default:
    tableData.push(...data);
  }
  
  const pageList = tableData.filter((item, index) => index < rows * page && index >= rows * (page - 1));

  return {
    'data': pageList,
    'total': tableData.length
  };
};
