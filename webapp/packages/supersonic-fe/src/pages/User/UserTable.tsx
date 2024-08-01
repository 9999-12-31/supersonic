import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { message, Button, Space, Popconfirm } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import UserSettingModal from './UserSettingModal';
import UserEditModal from './UserEditModal';

import moment from 'moment';

type Props = {};

const UserTable: React.FC<Props> = ({}) => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [databaseItem, setDatabaseItem] = useState<ISemantic.IDatabaseItem>();
  const [dataBaseList, setDataBaseList] = useState<any[]>([]);

  const actionRef = useRef<ActionType>();

  // 获取用户列表 查询接口
  const queryDatabaseList = async () => {
    const data = [
        {
            "id": 1,
            "name": "abc",
            "display_name": "测试一",
            "password": "123456",
            "email": "123@a.com",

        },
        {
            "id": 2,
            "name": "abcd",
            "display_name": "测试二",
            "password": "123456",
            "email": "123@a.com",

        },
        {
            "id": 3,
            "name": "abcde",
            "display_name": "测试三",
            "password": "123456",
            "email": "123@a.com",

        },
    ]
    setDataBaseList(data);
    console.log("Query");
    // const { code, data, msg } = await getDatabaseList();
    // if (code === 200) {
    //   setDataBaseList(data);
    // } else {
    //   message.error(msg);
    // }
  };

  // 删除接口
  function deleteDatabase(id) {
    return {
      code: 200,
      msg: '测试成功'
    }
  }

  useEffect(() => {
    queryDatabaseList();
  }, []);

  const columns: ProColumns[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 80,
    },
    {
      dataIndex: 'name',
      title: '用户名',
    },

    {
      dataIndex: 'display_name',
      title: '中文名',
    },
    {
      dataIndex: 'email',
      title: '电子邮箱',
    },
    {
      title: '操作',
      dataIndex: 'x',
      valueType: 'option',
      width: 100,
      render: (_, record) => {
        return (
          <Space>
            <a
              key="dimensionEditBtn"
              onClick={() => {
                setDatabaseItem(record);
                setEditModalVisible(true);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确认删除？"
              okText="是"
              cancelText="否"
              onConfirm={async () => {
                const { code, msg } = await deleteDatabase(record.id);
                if (code === 200) {
                  setDatabaseItem(undefined);
                  queryDatabaseList();
                } else {
                  message.error(msg);
                }
              }}
            >
              <a
                key="dimensionDeleteEditBtn"
                onClick={() => {
                  setDatabaseItem(record);
                }}
              >
                删除
              </a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ margin: 10 }}>
      <ProTable
        // className={`${styles.classTable}`}
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        dataSource={dataBaseList}
        search={false}
        tableAlertRender={() => {
          return false;
        }}
        size="small"
        options={{ reload: false, density: false, fullScreen: false }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            onClick={() => {
              setDatabaseItem(undefined);
              setCreateModalVisible(true);
            }}
          >
            新增用户
          </Button>,
        ]}
      />
      {createModalVisible && (
        <UserSettingModal
          open={createModalVisible}
          databaseItem={databaseItem}
          onCancel={() => {
            setCreateModalVisible(false);
          }}
          onSubmit={() => {
            setCreateModalVisible(false);
            queryDatabaseList();
          }}
        />
      )}
      {editModalVisible && (
        <UserEditModal
          open={editModalVisible}
          databaseItem={databaseItem}
          onCancel={() => {
            setEditModalVisible(false);
          }}
          onSubmit={() => {
            setEditModalVisible(false);
            queryDatabaseList();
          }}
        />
      )}
    </div>
  );
};
export default UserTable;
