const btns = {
  view: (h, params, vm) => {
    return h('Button', {
        props: {
          type: 'info',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-view', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-eye',
          size: 16,
          color: '#fff'
        }
      })
      ]);
  },
  edit: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'warning',
        size: 'small'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        click: () => {
          vm.$emit('on-edit', params);
        }
      }
    }, [h('Icon', {
      props: {
        type: 'md-create',
        size: 16,
        color: '#fff'
      }
    })
    ]);
  },
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params);
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex));
        }
      }
    }, [
      h('Button', {
        props: {
          type: 'error',
          size: 'small'
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-trash',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  }
};

export default btns;
