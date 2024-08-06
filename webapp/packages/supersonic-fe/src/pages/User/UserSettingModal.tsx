import React, { useState, useRef } from 'react';
import { message, Button, Modal, Space } from 'antd';
import { Form, Input } from 'antd';
import request from 'umi-request'
import CryptoJS from 'crypto-js';
import { encryptPassword } from '@/utils/utils';

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

  const encryptKey = CryptoJS.enc.Utf8.parse('supersonic@2024');

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
    // console.log(val)
    // 新用户创建提交
    request(`${process.env.AUTH_API_BASE_URL}user/register`, {
      method: 'post',
      data: { ...val, password: encryptPassword(val.password, encryptKey) }
    }).then(res => {
      if(res.code===200){
        message.success('添加成功')
        onSubmit();// 刷新查询
      }else{
        message.error('添加失败')
      }
    })
    // 设置请求结果
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
            label="账号"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
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
            label="姓名"
            name="displayName"
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[
            {
            type: "email",          // E-mail 格式类型
            message: "请输入正确的电子邮箱格式",
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
