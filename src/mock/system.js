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
