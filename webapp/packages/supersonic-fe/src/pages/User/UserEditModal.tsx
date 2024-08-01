import React, { useState, useRef } from 'react';
import { Button, Modal, Space } from 'antd';
import { Form, Input } from 'antd';

export type CreateFormProps = {
  onCancel: () => void;
  databaseItem?: ISemantic.IDatabaseItem;
  open: boolean;
  onSubmit: (values?: any) => void;
};

const UserEditModal: React.FC<CreateFormProps> = ({
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
    id?: number;
    name?: string;
    displayName?: string,
    email?: string;
  };

  let originValue = {
    id: databaseItem.id,
    name: databaseItem.name,
    displayName: databaseItem.displayName,
    email: databaseItem.email,
  }

  //编辑更新接口
  const onFinish=(val:any)=>{
    console.log(val)
    // 编辑内容提交
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
      title="编辑用户"
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
            label="用户id"
            name="id"
          >
            <Input defaultValue={originValue.id} disabled='true'/>
          </Form.Item>

          <Form.Item<FieldType>
            label="用户名"
            name="name"
          >
            <Input defaultValue={originValue.name}/>
          </Form.Item>

          <Form.Item<FieldType>
            label="中文名"
            name="displayName"
          >
            <Input defaultValue={originValue.displayName}/>
          </Form.Item>

          {/*<Form.Item<FieldType>
            label="密码"
            name="password"
          >
            <Input.Password defaultValue={originValue.password}/>
          </Form.Item>*/}

          <Form.Item<FieldType>
            label="Email"
            name="email"
          >
            <Input defaultValue={originValue.email}/>
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

export default UserEditModal;
