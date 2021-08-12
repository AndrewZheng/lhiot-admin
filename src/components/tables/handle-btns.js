const btns = {
  view: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '查看' }
    }, [
      h('Button', {
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
      }, [
        h('Icon', {
          props: {
            type: 'md-eye',
            size: 16,
            color: '#fff'
          }
        })
      ])]);
  },
  abolish: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.isEdit) {
      return h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '取消' }
      }, [
        h('Button', {
          props: {
            type: 'info',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              vm.$emit('on-abolish', params);
            }
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-close',
              size: 16,
              color: '#fff'
            }
          })
        ])]);
    } else {
      return ''
    }
  },
  edit: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '修改' }
    }, [
      h('Button', {
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
      }, [
        h('Icon', {
          props: {
            type: 'md-create',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  orderEdit: (h, params, vm) => {
    const { row } = params;
    if (row.orderStatus === 'WAIT_SEND_OUT' && row.receivingWay === 'TO_THE_HOME') {
      return h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '修改' }
      }, [
        h('Button', {
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
        }, [
          h('Icon', {
            props: {
              type: 'md-create',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return '';
    }
  },
  operate: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '查看 / 审核' }
    }, [
      h('Button', {
        props: {
          type: 'warning',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-operate', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-ionic',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '你确定要删除吗?',
        placement: params.index === 0 ? 'right' : 'top'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params);
        }
      }
    }, [
      h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '删除' }
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
      ])
    ]);
  },
  saleAudit: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.userType === 'sale' && row.salesUserStatus === 'unaudited') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '该业务员资质已核实，是否通过业务员申请?',
          placement: params.index === 0 ? 'right' : 'top',
          'ok-text': '通过',
          'cancel-text': '拒绝'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-audit', { params, checkStatus: 'PASSED' });
          },
          'on-cancel': () => {
            vm.$emit('on-audit', { params, checkStatus: 'REJECTED' });
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '审核业务员' }
        }, [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'md-person-add',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return ''
    }
  },
  onUser: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.userType === 'consumer') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要将此用户转为业务员吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-user', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '转为业务员' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'md-repeat',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要将此业务员变为普通用户吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-user', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '转为普通用户' }
        }, [
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'md-repeat',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    }
  },
  relation: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '关联角色' }
    }, [
      h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-relation', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-unlock',
          size: 16,
          color: '#fff'
        }
      })
      ])
    ]);
  },
  exchange: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '更换' }
    }, [
      h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-exchange', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-repeat',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  userChange: (h, params, vm) => {
    const { row } = params;
    if (row.userType === 'consumer' && (row.loginName === 'admin' || row.loginName === 'wygl_operator' || row.loginName === 'lhgy_lvA' || row.loginName === 'qgg_operator' || row.loginName === 'pf_admin')) {
      return h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '更换所属业务员' }
      }, [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              vm.$emit('on-userChange', params);
            }
          }
        }, [
          h('Icon', {
            props: {
              type: 'ios-switch',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return ''
    }
  },
  unlock: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.userStatus === 'locking' || row.userStatus === 'certified') {
      if (row.userStatus === 'locking') {
        return h('Poptip', {
          props: {
            confirm: true,
            transfer: true,
            title: '确认要将此用户解锁吗?',
            placement: params.index === 0 ? 'right' : 'top'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-unlock', params);
            }
          }
        }, [
          h('Tooltip', {
            props: { placement: 'top', transfer: true, content: '解锁用户' }
          }, [
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              }
            }, [
              h('Icon', {
                props: {
                  type: 'ios-key',
                  size: 16,
                  color: '#fff'
                }
              })
            ])
          ])
        ]);
      } else {
        return h('Poptip', {
          props: {
            confirm: true,
            transfer: true,
            title: '确认要将此用户锁定吗?',
            placement: params.index === 0 ? 'right' : 'top'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-unlock', params);
            }
          }
        }, [
          h('Tooltip', {
            props: { placement: 'top', transfer: true, content: '锁定用户' }
          }, [
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              }
            }, [
              h('Icon', {
                props: {
                  type: 'ios-key',
                  size: 16,
                  color: '#fff'
                }
              })
            ])
          ])
        ]);
      }
    } else {
      return ''
    }
  },
  permission: (h, params, vm) => {
    const {
      row
    } = params;
    // 父级菜单不显示修改权限按钮
    if (row.type === 'PARENT') {
      return '';
    } else {
      return h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-edit-permission', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-lock',
          size: 16,
          color: '#fff'
        }
      })]);
    }
  },
  discount: (h, params, vm) => {
    const { row } = params;
    if (row.productType === 'ORDINARY_PRODUCT' || row.productType === 'TEAM_BUY_PRODUCT' ||
       row.productType === 'PRE_SALE_PRODUCT' || row.productType === 'SHARE_PRODUCT' || row.productType === 'POINTS_LOTTERY_PRODUCT') {
      return '';
    } else {
      return h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '折扣' }
      }, [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              vm.$emit('on-discount', params);
            }
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-pricetags',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    }
  },
  onSale: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.shelfStatus === 'ON' || row.onOff === 'ON' || row.state === 'ON' || row.couponStatus === 'VALID' || row.status === 'ON' || row.status === 'VALID' || row.vaild === 'yes' || row.couponConfigvaild === 'yes') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: row.vaild === 'yes' || row.status === 'VALID' ? '确认要关闭活动吗?' : '确认要下架吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-sale', params);
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
              type: 'md-cloud-download',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: row.vaild === 'no' || row.status === 'INVALID' ? '确认要开启活动吗?' : '确认要上架吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-sale', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-cloud-upload',
              size: 16,
              color: '#green'
            }
          })
        ])
      ]);
    }
  },
  // 定制计划商品上下架操作
  customOnSale: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.status === 'VALID' || row.shelvesStatus === 'VALID' || row.ifEffective === 'VALID' || row.vaild === 'yes') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要下架吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('custom-on-sale', params);
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
              type: 'md-cloud-download',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要上架吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('custom-on-sale', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-cloud-upload',
              size: 16,
              color: '#green'
            }
          })
        ])
      ]);
    }
  },
  // 商品规格选择部分门店-发布
  publish: (h, params, vm) => {
    const { row } = params;
    if (row.productType === 'ORDINARY_PRODUCT' && row.shelvesStatus === 'VALID') {
      return h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '发布' }
      }, [
        h('Poptip', {
          props: {
            confirm: true,
            transfer: true,
            title: '确认要发布吗?'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-publish', params);
            }
          }
        }, [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-paper-plane',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return '';
    }
  },
  // 优惠券上下架操作
  couponStatus: (h, params, vm) => {
    const { row } = params;
    if (row.couponStatus === 'VALID' || row.status === 'VALID') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要下架吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('coupon-status', params);
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
              type: 'md-cloud-download',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要上架吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('coupon-status', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-cloud-upload',
              size: 16,
              color: '#green'
            }
          })
        ])
      ]);
    }
  },
  // 兑换商品实物上下架操作
  proStatus: (h, params, vm) => {
    const { row } = params;
    if (row.status === 'VALID') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要下架吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('pro-status', params);
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
              type: 'md-cloud-download',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要上架吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('pro-status', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-cloud-upload',
              size: 16,
              color: '#green'
            }
          })
        ])
      ]);
    }
  },
  push: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'success',
        size: 'small'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        click: () => {
          vm.$emit('on-push', params);
        }
      }
    }, [h('Icon', {
      props: {
        type: 'ios-fastforward-outline',
        size: 16,
        color: '#fff'
      }
    })]);
  },
  relevance: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'success',
        size: 'small'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        click: () => {
          vm.$emit('on-relevance', params);
        }
      }
    }, [h('Icon', {
      props: {
        type: 'md-attach',
        size: 16,
        color: '#fff'
      }
    })]);
  },
  settings: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '设置' }
    }, [
      h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-relevance', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-settings',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  // 手动退款
  onHand: (h, params, vm) => {
    const { row } = params;
    if (row.orderType !== 'POINTS_LOTTERY') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要退款?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-hand', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '手动退款' }
        }, [
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'logo-usd',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return '';
    }
  },
  sendHd: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '确认要重新发送海鼎吗?',
        placement: params.index === 0 ? 'left' : 'top'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-send-hd', params);
        }
      }
    }, [
      h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '海鼎重发' }
      }, [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'ios-paper-plane',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ])
    ]);
  },
  afterSale: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '是否确认要售后?',
        placement: params.index === 0 ? 'left' : 'top'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-afterSale', params);
        }
      }
    }, [
      h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '手动售后' }
      }, [
        h('Button', {
          props: {
            type: 'primary',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-hand',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ])
    ]);
  },
  // 邮费复制操作
  copy: (h, params, vm) => {
    return h('Button', {
      props: {
        type: 'success',
        size: 'small'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        click: () => {
          vm.$emit('on-copy', params);
        }
      }
    }, [h('Icon', {
      props: {
        type: 'md-copy',
        size: 16,
        color: '#fff'
      }
    })]);
  },
  // 用户锁定状态按钮
  usable: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.locked === 'LOCK') {
      return h('Poptip', {
        props: {
          confirm: true,
          title: '确认要解除该账号的禁用吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-usable', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-lock',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          title: '确认要禁用该账号吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-usable', params);
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
              type: 'md-unlock',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    }
  },
  // 鲜果师审核<Icon custom="iconfont icon-bumenzhinenggongzuoshenhe"/>
  auditor: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.auditStatus === 'UNAUDITED') {
      return h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-auditor', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-hammer', // iconfont icon-shenhe
          size: 16,
          color: '#fff'
        }
      })]);
    }
  },
  // articleStatus发布状态（PUBLISH-发布 UN_PUBLISH-未发布）
  onArticleStatus: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.articleStatus === 'UN_PUBLISH') {
      return h('Poptip', {
        props: {
          confirm: true,
          title: '确认要把该文章改成发布吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-publish', params);
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
              type: 'md-cloud-download',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          title: '确认要把该文章改未发布吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-publish', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-cloud-upload',
              size: 16,
              color: '#green'
            }
          })
        ])
      ]);
    }
  },
  customPlanProduct: (h, params, vm) => {
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
          vm.$emit('on-custom-plan-product', params);
        }
      }
    }, [h('Icon', {
      props: {
        type: 'md-settings',
        size: 16,
        color: '#fff'
      }
    })]);
  },
  inlineEdits: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.status === 'WAIT') {
      if (row.isEdit === false) {
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
              vm.$emit('on-inline-edit', params);
            }
          }
        }, [h('Icon', {
          props: {
            type: 'md-create',
            size: 16,
            color: '#fff'
          }
        })]);
      } else {
        return h('Button', {
          props: {
            type: 'success',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              vm.$emit('on-inline-save', params);
            }
          }
        }, [h('Icon', {
          props: {
            type: 'md-checkmark',
            size: 16,
            color: '#green'
          }
        })]);
      }
    }
  },
  inlineEdit: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.isEdit === false) {
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
            vm.$emit('on-inline-edit', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-create',
          size: 16,
          color: '#fff'
        }
      })]);
    } else {
      return h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-inline-save', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-checkmark',
          size: 16,
          color: '#green'
        }
      })]);
    }
  },
  amendEdit: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.isEdit === false) {
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
            vm.$emit('on-inline-edit', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'ios-create',
          size: 16,
          color: '#fff'
        }
      })]);
    } else {
      return h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-inline-save', params);
          }
        }
      }, [h('Icon', {
        props: {
          type: 'md-checkmark',
          size: 16,
          color: '#green'
        }
      })]);
    }
  },
  settlementRefund: (h, params, vm) => {
    const { row } = params;
    // 薪资已过期显示退款按钮
    if (row.settlementStatus === 'EXPIRED') {
      return h('Poptip', {
        props: {
          confirm: true,
          title: '你确定要退款吗?'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-refund', params);
            // 页面验证 删除成功则刷新表格内容
            // vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex));
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'error',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          }
        }, [h('Icon', {
          props: {
            type: 'md-log-out',
            size: 16,
            color: '#fff'
          }
        })
        ])
      ]);
    } else {
      return '';
    }
  },
  settlementEdit: (h, params, vm) => {
    const { row } = params;
    // 除了薪资未审核的其他不显示修改权限按钮
    if (row.settlementStatus === 'UNSETTLED') {
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
      })]);
    } else {
      return '';
    }
  },
  feedback: (h, params, vm) => {
    const { row } = params;
    // 除了未回复的其他不显示修改按钮
    if (row.status === 'UNREPLY') {
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
      })]);
    } else {
      return '';
    }
  },
  // 门店状态 ENABLED(营业),DISABLED(未营业);
  onStoreStatus: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.status === 'DISABLED' || row.storeStatus === 'DISABLED') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要把该门店改为营业吗?',
          placement: params.index === 0 || params.index === 1 ? 'bottom' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-storeStatus', params);
          }
        }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-cloud-upload',
              size: 16,
              color: '#green'
            }
          })
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要把该门店改为未营业吗?',
          placement: params.index === 0 || params.index === 1 ? 'bottom' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-storeStatus', params);
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
              type: 'md-cloud-download',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ]);
    }
  },
  // 确认收货
  onReceive: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.orderType != 'BUY_COUPON_ALL_ORDER') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要收货?'
        // placement: params.index === 0 || params.index === 1 ? 'bottom' : 'top',
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-receive', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '确认收货' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'md-checkbox',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return ''
    }
  },
  // 发送美团
  onMeituan: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.orderType != 'BUY_COUPON_ALL_ORDER') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '是否发送美团?'
        // placement: params.index === 0 || params.index === 1 ? 'bottom' : 'top',
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-meituan', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '发送美团' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-paper-plane',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return ''
    }
  },
  // 购券重发
  onCoupon: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.orderType === 'BUY_COUPON_ALL_ORDER' && row.orderStatus === 'WAIT_SEND_OUT') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '是否购券重发?'
          // placement: params.index === 0 || params.index === 1 ? 'bottom' : 'top',
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-coupon', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '购券重发' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'md-sync',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return ''
    }
  },
  analytics: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '业绩分析' }
    }, [
      h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-analytics', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-analytics',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  setVip: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.isVip === 'no') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要将此用户升级为VIP吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-set-vip', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '升级为VIP' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'logo-vimeo',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要将此VIP用户变为普通用户吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-set-vip', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '降级为普通用户' }
        }, [
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'logo-vimeo',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    }
  },
  upgrade: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.userClass === 'EXTERIOR' || row.userClass === null) {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '将此用户升级为白名单?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-upgrade', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '升级为白名单' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-cloud-upload',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '将此用户取消白名单?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-upgrade', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '取消白名单' }
        }, [
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-cloud-download',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    }
  },
  // 查询改用户当前券列表
  searchCoupons: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '查询券列表' }
    }, [
      h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-coupons', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-pricetags',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  // 员工特权
  staff: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.phone) {
      if (row.userType === 'CONSUMER') {
        return h('Poptip', {
          props: {
            confirm: true,
            transfer: true,
            title: '将此用户设为员工?',
            placement: params.index === 0 ? 'right' : 'top'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-staff', params);
            }
          }
        }, [
          h('Tooltip', {
            props: { placement: 'top', transfer: true, content: '设为员工' }
          }, [
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              }
            }, [
              h('Icon', {
                props: {
                  type: 'ios-checkmark-circle-outline',
                  size: 16,
                  color: '#fff'
                }
              })
            ])
          ])
        ]);
      } else {
        return h('Poptip', {
          props: {
            confirm: true,
            transfer: true,
            title: '取消此用户员工特权?',
            placement: params.index === 0 ? 'right' : 'top'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            'on-ok': () => {
              vm.$emit('on-staff', params);
            }
          }
        }, [
          h('Tooltip', {
            props: { placement: 'top', transfer: true, content: '取消员工' }
          }, [
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              }
            }, [
              h('Icon', {
                props: {
                  type: 'ios-close-circle-outline',
                  size: 16,
                  color: '#fff'
                }
              })
            ])
          ])
        ]);
      }
    }
  },
  // 评论 置顶
  setTop: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.istop === 'NO') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要将此评论置顶吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-set-top', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '置顶评论' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-thumbs-up',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要将此评论取消置顶吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-set-top', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '取消置顶' }
        }, [
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-thumbs-up',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    }
  },
  // 评论 显示
  setSta: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.status === 'HIDE') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要显示该评论吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-set-sta', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '显示评论' }
        }, [
          h('Button', {
            props: {
              type: 'success',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-flame',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '确认要隐藏该评论吗?',
          placement: params.index === 0 ? 'right' : 'top'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-set-sta', params);
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '隐藏评论' }
        }, [
          h('Button', {
            props: {
              type: 'error',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'ios-flame-outline',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    }
  },
  finish: (h, params, vm) => {
    const { row } = params;
    // 除了薪资未审核的其他不显示修改权限按钮
    if (row.status === 'SERVICEING') {
      return h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '售后完成' }
      }, [
        h('Button', {
          props: {
            type: 'info',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              vm.$emit('on-finish', params);
            }
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-checkmark-circle',
              size: 16,
              color: '#fff'
            }
          })
        ])]);
    } else {
      return ''
    }
  },
  financeAudit: (h, params, vm) => {
    const {
      row
    } = params;
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '是否审核通过?',
        placement: params.index === 0 ? 'right' : 'top'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-audit', params);
        }
      }
    }, [
      h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '审核通过' }
      }, [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-checkbox',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ])
    ]);
  },
  financeRefuse: (h, params, vm) => {
    const {
      row
    } = params;
    return h('Poptip', {
      props: {
        confirm: true,
        transfer: true,
        title: '是否拒绝审核?',
        placement: params.index === 0 ? 'right' : 'top'
      },
      style: {
        marginRight: '5px'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-refuse', params);
        }
      }
    }, [
      h('Tooltip', {
        props: { placement: 'top', transfer: true, content: '审核拒绝' }
      }, [
        h('Button', {
          props: {
            type: 'error',
            size: 'small'
          }
        }, [
          h('Icon', {
            props: {
              type: 'md-backspace',
              size: 16,
              color: '#fff'
            }
          })
        ])
      ])
    ]);
  },
  staffAudit: (h, params, vm) => {
    const {
      row
    } = params;
    if (row.auditStatus === 'UNAUDITED') {
      return h('Poptip', {
        props: {
          confirm: true,
          transfer: true,
          title: '是否通过员工特权申请?',
          placement: params.index === 0 ? 'right' : 'top',
          'ok-text': '通过',
          'cancel-text': '拒绝'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          'on-ok': () => {
            vm.$emit('on-staffAudit', { params, checkStatus: 'PASSED' });
          },
          'on-cancel': () => {
            vm.$emit('on-staffAudit', { params, checkStatus: 'REJECTED' });
          }
        }
      }, [
        h('Tooltip', {
          props: { placement: 'top', transfer: true, content: '审核员工' }
        }, [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            }
          }, [
            h('Icon', {
              props: {
                type: 'md-person-add',
                size: 16,
                color: '#fff'
              }
            })
          ])
        ])
      ]);
    } else {
      return 'N/A'
    }
  },
  proAnalytics: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '商品分析' }
    }, [
      h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-analytics', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-analytics',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  linkGenerate: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '生成链接' }
    }, [
      h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-link-generate', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'ios-link',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  rewardAnalytics: (h, params, vm) => {
    const { row } = params;
    if (!row.dataTotalJsonStr) { return ''; }
    const { NO_REWARD, WAIT_RECEIVE, EXPIRE, RECEIVE, FAILED } = JSON.parse(row.dataTotalJsonStr);
    return h('Tooltip', {
      props: {
        placement: 'top',
        wordWrap: true,
        transfer: true,
        content: `已领取-${RECEIVE} / 待领取-${WAIT_RECEIVE} / 未中奖-${NO_REWARD} / 领取失败-${FAILED} / 已过期-${EXPIRE}`,
        trigger: 'hover',
        maxWidth: '180px'
      }
    }, [
      h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-analytics',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  },
  passwordModify: (h, params, vm) => {
    return h('Tooltip', {
      props: { placement: 'top', transfer: true, content: '修改密码' }
    }, [
      h('Button', {
        props: {
          type: 'warning',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.$emit('on-password-modify', params);
          }
        }
      }, [
        h('Icon', {
          props: {
            type: 'ios-lock',
            size: 16,
            color: '#fff'
          }
        })
      ])
    ]);
  }
};

export default btns;
