import React, { useState, useRef } from 'react';
import { Button, Modal, Space } from 'antd';
import { Form, Input } from 'antd';

export type CreateFormProps = {
  onCancel: () => void;
  databaseItem?: ISemantic.IDatabaseItem;
  open: boolean;
  onSubmit: (values?: any) => void;
};

const UserSettingModal: React.FC<CreateFormProps> = ({
  onCancel,
  databaseItem,
  open,
  onSubmit,
}) => {
  const [testLoading, setTestLoading] = useState<boolean>(false);

  const createFormRef = useRef<any>({});

  const renderFooter = () => {
    return (
      <>
      </>
    );
  };

  type FieldType = {
    name?: string;
    displayName?: string,
    password?: string;
    email?: string;
  };

  //新增接口
  const onFinish=(val:any)=>{
    console.log(val)
    // 新用户创建提交
    // 设置请求结果
    onSubmit();// 刷新查询

  }

  const onFinishFailed=(val:any)=>{
    console.log('创建失败！')
  }

  return (
    <Modal
      width={600}
      destroyOnClose
      title="新增用户"
      style={{ top: 48 }}
      maskClosable={false}
      open={open}
      footer={renderFooter()}
      onCancel={onCancel}
    >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="用户名"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="中文名"
            name="displayName"
            rules={[{ required: true, message: 'Please input your rolename!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' },
            {
            type: "email",          // E-mail 格式类型
            message: "The input is not valid E-mail",
            },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
    </Modal>
  );
};

export default UserSettingModal;
