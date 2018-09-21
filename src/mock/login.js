import {
  getParams
} from '@/libs/util';

const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  },
  opreator: {
    name: 'opreator',
    user_id: '3',
    access: ['opreator'],
    token: 'opreator',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
};

export const login = req => {
  req = JSON.parse(req.body);
  return {
    token: USER_MAP[req.userName].token
  };
};

export const getUserInfo = req => {
  const params = getParams(req.url);
  return USER_MAP[params.token];
};

export const logout = req => {
  return null;
};

export const getMenusByUser = req => {
  const params = getParams(req.url);
  const {
    userid
  } = params;

  return {
    'userid': userid,
    'menuList': [{
        'id': '1',
        'parentid': 0,
        'name': 'home',
        'path': '/home',
        'title': '首页',
        'icon': 'ios-home',
        'children': []
      },
      {
        'id': '2',
        'parentid': 0,
        'name': 'doc',
        'path': '',
        'title': '文档',
        'icon': 'ios-book',
        'href': 'https://lison16.github.io/iview-admin-doc/#/',
        'children': []
      },
      {
        'id': '3',
        'parentid': 0,
        'name': 'join',
        'path': '/join',
        'title': '',
        'icon': '',
        'children': [{
          'id': '4',
          'parentid': 3,
          'name': 'join_page',
          'path': 'join_page',
          'title': '实战演练',
          'icon': '_qq',
          'href': ''
        }]
      },
      {
        'id': '5',
        'parentid': 0,
        'name': 'components',
        'path': '/components',
        'title': '组件',
        'icon': 'logo-buffer',
        'children': [{
            'id': '6',
            'parentid': 5,
            'name': 'count_to_page',
            'path': 'count_to_page',
            'title': '数字渐变',
            'icon': 'md-trending-up'
          },
          {
            'id': '7',
            'parentid': 5,
            'name': 'drag_list_page',
            'path': 'drag_list_page',
            'title': '拖拽列表',
            'icon': 'ios-infinite'
          },
          {
            'id': '8',
            'parentid': 5,
            'path': 'tables_page',
            'name': 'tables_page',
            'title': '多功能表格',
            'icon': 'md-grid'
          },
          {
            'id': '9',
            'parentid': 5,
            'path': 'split_pane_page',
            'name': 'split_pane_page',
            'title': '分割窗口',
            'icon': 'md-pause'
          },
          {
            'id': '10',
            'parentid': 5,
            'path': 'markdown_page',
            'name': 'markdown_page',
            'icon': 'logo-markdown',
            'title': 'Markdown编辑器'
          },
          {
            'id': '11',
            'parentid': 5,
            'path': 'editor_page',
            'name': 'editor_page',
            'icon': 'ios-create',
            'title': '富文本编辑器'
          },
          {
            'id': '12',
            'parentid': 5,
            'path': 'icons_page',
            'name': 'icons_page',
            'icon': '_bear',
            'title': '自定义图标'
          }
        ]
      }
    ]
  };
};
