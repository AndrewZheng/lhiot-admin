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
        'meta': {
          'title': '后台管理系统',
          'icon': 'logo-steam'
        }
      },
      {
        'id': 2,
        'parentid': null,
        'code': 'team-buy-system',
        'sort': 1,
        'meta': {
          'title': '拼团小程序',
          'icon': 'logo-instagram'
        }
      },
      {
        'id': 3,
        'parentid': null,
        'code': 'wechat-system',
        'sort': 3,
        'meta': {
          'title': '微商城小程序',
          'icon': 'logo-instagram'
        }
      },
      {
        'id': 4,
        'parentid': null,
        'code': 'app',
        'sort': 4,
        'meta': {
          'title': 'App应用',
          'icon': 'logo-whatsapp'
        }
      },
      {
        'id': 5,
        'parentid': null,
        'code': 'wechat-user',
        'sort': 5,
        'meta': {
          'title': '微商城用户',
          'icon': 'md-person'
        }
      },
      {
        'id': 6,
        'parentid': 1,
        'code': 'home',
        'path': '/home',
        'meta': {
          'title': '首页',
          'icon': 'ios-home'
        }
      },
      {
        'id': 7,
        'parentid': 1,
        'code': 'components',
        'path': '/components',
        'meta': {
          'title': '组件',
          'icon': 'logo-buffer'
        }
      },
      {
        'id': 8,
        'parentid': 7,
        'code': 'count_to_page',
        'path': 'count_to_page',
        'meta': {
          'title': '数字渐变',
          'icon': 'md-trending-up'
        }
      },
      {
        'id': 9,
        'parentid': 7,
        'code': 'drag_list_page',
        'path': 'drag_list_page',
        'meta': {
          'title': '拖拽列表',
          'icon': 'ios-infinite'
        }
      },
      {
        'id': 10,
        'parentid': 7,
        'path': 'tables_page',
        'code': 'tables_page',
        'meta': {
          'title': '多功能表格',
          'icon': 'md-grid'
        }
      },
      {
        'id': 11,
        'parentid': 7,
        'path': 'split_pane_page',
        'code': 'split_pane_page',
        'meta': {
          'title': '分割窗口',
          'icon': 'md-pause'
        }
      },
      {
        'id': 12,
        'parentid': 7,
        'path': 'markdown_page',
        'code': 'markdown_page',
        'meta': {
          'icon': 'logo-markdown',
          'title': 'Markdown编辑器'
        }
      },
      {
        'id': 13,
        'parentid': 7,
        'path': 'editor_page',
        'code': 'editor_page',
        'meta': {
          'icon': 'ios-create',
          'title': '富文本编辑器'
        }
      },
      {
        'id': 14,
        'parentid': 7,
        'path': 'icons_page',
        'code': 'icons_page',
        'meta': {
          'icon': '_bear',
          'title': '自定义图标'
        }
      },
      {
        'id': 15,
        'parentid': 7,
        'path': 'tinymce_editor_page',
        'code': 'tinymce_editor_page',
        'meta': {
          'icon': 'ios-create',
          'title': 'Tinymce编辑器'
        }
      },
      {
        'id': 16,
        'parentid': 1,
        'code': 'system',
        'path': '/system',
        'meta': {
          'title': '系统管理',
          'icon': 'ios-settings'
        }
      },
      {
        'id': 17,
        'parentid': 16,
        'code': 'menu',
        'path': 'menu',
        'meta': {
          'title': '菜单管理',
          'icon': 'ios-settings'
        }
      },
      {
        'id': 18,
        'parentid': 16,
        'code': 'config',
        'path': 'config',
        'meta': {
          'title': '参数管理',
          'icon': 'md-settings'
        }
      },
      {
        'id': 19,
        'parentid': 16,
        'code': 'permission',
        'path': 'permission',
        'meta': {
          'title': '权限管理',
          'icon': 'md-lock'
        }
      },
      {
        'id': 20,
        'parentid': 16,
        'code': 'role',
        'path': 'role',
        'meta': {
          'title': '角色管理',
          'icon': 'ios-people'
        }
      },
      {
        'id': 21,
        'parentid': 2,
        'code': 'doc',
        'path': '',
        'meta': {
          'title': '文档',
          'icon': 'ios-book',
          'href': 'https://lison16.github.io/iview-admin-doc/#/'
        }
      },
      {
        'id': 22,
        'parentid': 2,
        'path': '/excel',
        'code': 'excel',
        'meta': {
          'icon': 'ios-stats',
          'title': 'EXCEL导入导出'
        }
      },
      {
        'id': 23,
        'parentid': 2,
        'path': 'upload-excel',
        'code': 'upload-excel',
        'meta': {
          icon: 'md-add',
          title: '导入EXCEL'
        }
      },
      {
        'id': 24,
        'parentid': 2,
        'path': 'export-excel',
        'code': 'export-excel',
        'meta': {
          icon: 'md-download',
          title: '导出EXCEL'
        }
      }
    ]
  };
};
