import { getParams } from '@/libs/util';
export const getRouteListById = req => {
  const params = getParams(req.url);
  const { pid } = params;
  let routes = {};
  switch (pid) {
    case '1':
      routes = {
        'array': [{
            'id': '1',
            'parentid': 0,
            'code': 'home',
            'path': '/home',
            'component': 'Home',
            'meta': {
              'title': '首页',
              'icon': 'ios-home',
              hideInMenu: true,
              notCache: true
            }
          },
          {
            'id': '5',
            'parentid': 0,
            'code': 'components',
            'path': '/components',
            'meta': {
              'title': '组件',
              'icon': 'logo-buffer'
            },
            'component': 'Main'
          },
          {
            'id': '6',
            'parentid': 5,
            'code': 'count_to_page',
            'path': 'count_to_page',
            'component': 'CountTo',
            'meta': {
              'title': '数字渐变',
              'icon': 'md-trending-up'
            }
          },
          {
            'id': '7',
            'parentid': 5,
            'code': 'drag_list_page',
            'path': 'drag_list_page',
            'component': 'DragList',
            'meta': {
              'title': '拖拽列表',
              'icon': 'ios-infinite'
            }
          },
          {
            'id': '8',
            'parentid': 5,
            'path': 'tables_page',
            'code': 'tables_page',
            'component': 'Tables',
            'meta': {
              'title': '多功能表格',
              'icon': 'md-grid'
            }
          },
          {
            'id': '9',
            'parentid': 5,
            'path': 'split_pane_page',
            'code': 'split_pane_page',
            'component': 'SplitPane',
            'meta': {
              'title': '分割窗口',
              'icon': 'md-pause'
            }
          },
          {
            'id': '10',
            'parentid': 5,
            'path': 'markdown_page',
            'code': 'markdown_page',
            'component': 'MarkDown',
            'meta': {
              'icon': 'logo-markdown',
              'title': 'Markdown编辑器'
            }
          },
          {
            'id': '11',
            'parentid': 5,
            'path': 'editor_page',
            'code': 'editor_page',
            'component': 'Editor',
            'meta': {
              'icon': 'ios-create',
              'title': '富文本编辑器'
            }
          },
          {
            'id': '12',
            'parentid': 5,
            'component': 'Icons',
            'path': 'icons_page',
            'code': 'icons_page',
            'meta': {
              'icon': '_bear',
              'title': '自定义图标'
            }
          },
          {
            'id': '13',
            'parentid': 5,
            'path': 'tinymce_editor_page',
            'code': 'tinymce_editor_page',
            'component': 'TinymceEditor',
            'meta': {
              'icon': 'ios-create',
              'title': 'Tinymce编辑器'
            }
          },
          {
            'id': '17',
            'parentid': 0,
            'code': 'system',
            'path': '/system',
            'meta': {
              'title': '系统管理',
              'icon': 'ios-settings'
            },
            'component': 'Main'
          },
          {
            'id': '18',
            'parentid': 17,
            'code': 'menu',
            'path': 'menu',
            'meta': {
              'title': '菜单管理',
              'icon': 'ios-settings'
            }
          },
          {
            'id': '19',
            'parentid': 17,
            'code': 'config',
            'path': 'config',
            'meta': {
              'title': '参数管理',
              'icon': 'md-settings'
            }
          },
          {
            'id': '20',
            'parentid': 17,
            'code': 'permission',
            'path': 'permission',
            'meta': {
              'title': '权限管理',
              'icon': 'md-lock'
            }
          },
          {
            'id': '21',
            'parentid': 17,
            'code': 'role',
            'path': 'role',
            'meta': {
              'title': '角色管理',
              'icon': 'ios-people'
            }
          },
          {
            'id': 25,
            'parentid': 17,
            'code': 'user',
            'path': 'user',
            'meta': {
              'title': '用户管理',
              'icon': 'md-person'
            },
            'type': 'SON'
          }
        ]
      };
      break;
    case '7':
      routes = {
        'array': [{
            'id': '2',
            'parentid': 0,
            'code': 'doc',
            'path': '',
            'meta': {
              'title': '文档',
              'icon': 'ios-book',
              'href': 'https://lison16.github.io/iview-admin-doc/#/'
            }
          },
          {
            'id': '14',
            'parentid': 0,
            'path': '/excel',
            'code': 'excel',
            'component': 'Main',
            'meta': {
              'icon': 'ios-stats',
              'title': 'EXCEL导入导出'
            }
          },
          {
            'id': '15',
            'parentid': 14,
            'component': 'Icons',
            'path': 'upload-excel',
            'code': 'upload-excel',
            'meta': {
              icon: 'md-add',
              title: '导入EXCEL'
            }
          },
          {
            'id': '16',
            'parentid': 14,
            'component': 'Icons',
            'path': 'export-excel',
            'code': 'export-excel',
            'meta': {
              icon: 'md-download',
              title: '导出EXCEL'
            }
          }
        ]
      };
      break;
  };
  console.log('res from mock: ', routes);
  return routes;
};

export const getSystemList = req => {
  return {
    'array': [{
        'pid': null,
        'id': 1,
        'name': '拼团小程序',
        'code': 'team-buy-system',
        'status': null,
        'sort': 1,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 7,
        'name': '后台管理系统',
        'code': 'system',
        'status': null,
        'sort': null,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 2,
        'name': '微商城小程序',
        'code': 'wechat-system',
        'status': null,
        'sort': 2,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 3,
        'name': 'App应用',
        'code': 'app',
        'status': null,
        'sort': 3,
        'icon': '-'
      },
      {
        'pid': null,
        'id': 5,
        'name': '微商城用户管理',
        'code': 'wechat-user',
        'status': null,
        'sort': 100,
        'icon': '-'
      }
    ]
  };
};

export const getMenuList = req => {
  return {
    'array': [{
        'id': 1,
        'parentid': null,
        'code': 'system',
        'sort': 2,
        'title': '后台管理系统',
        'meta': {
          'title': '后台管理系统',
          'icon': 'logo-steam'
        },
        'type': 'PARENT'
      },
      {
        'id': 2,
        'parentid': null,
        'code': 'team-buy-system',
        'sort': 1,
        'title': '拼团小程序',
        'meta': {
          'title': '拼团小程序',
          'icon': 'logo-instagram'
        },
        'type': 'PARENT'
      },
      {
        'id': 3,
        'parentid': null,
        'code': 'wechat-system',
        'sort': 3,
        'title': '微商城小程序',
        'meta': {
          'title': '微商城小程序',
          'icon': 'logo-instagram'
        },
        'type': 'PARENT'
      },
      {
        'id': 4,
        'parentid': null,
        'code': 'app',
        'sort': 4,
        'title': 'App应用',
        'meta': {
          'title': 'App应用',
          'icon': 'logo-whatsapp'
        },
        'type': 'PARENT'
      },
      {
        'id': 5,
        'parentid': null,
        'code': 'wechat-user',
        'sort': 5,
        'title': '微商城用户',
        'meta': {
          'title': '微商城用户',
          'icon': 'md-person'
        },
        'type': 'PARENT'
      },
      {
        'id': 6,
        'parentid': 1,
        'sort': 1,
        'code': 'home',
        'path': '/home',
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
      },
      {
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
      },
      {
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
      },
      {
        'id': 24,
        'parentid': 5,
        'sort': 19,
        'path': 'export-excel',
        'code': 'export-excel',
        'title': '导出EXCEL',
        'meta': {
          icon: 'md-download',
          title: '导出EXCEL'
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
      }
    ]
  };
};
