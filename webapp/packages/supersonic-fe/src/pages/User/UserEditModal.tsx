import React, { useState, useRef } from 'react';
import { Button, Modal, Space } from 'antd';
import { message, Form, Input } from 'antd';
import request from 'umi-request';
import CryptoJS from 'crypto-js';
import { encryptPassword } from '@/utils/utils';

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
  const encryptKey = CryptoJS.enc.Utf8.parse('supersonic@2024');

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
    password?: string,
    // password_verify?: string,
    email?: string;
  };

  let originValue = {
    id: databaseItem.id,
    name: databaseItem.name,
    displayName: databaseItem.displayName,
    password: databaseItem.password,
    email: databaseItem.email,
  }

  //编辑更新接口
  const onFinish=(val:any)=>{
    const post_data = {
      name: originValue.name,
      displayName: val.displayName,
      email: val.email,
      password: val.password
    }
    // console.log(post_data)
    // 编辑内容提交
    request(`${process.env.AUTH_API_BASE_URL}user/edit`, {
      method: 'post',
      data: { ...post_data, password: encryptPassword(post_data.password, encryptKey) }
    }).then(res => {
      console.log(res);
      if(res.code===200){
        message.success('编辑成功')
        onSubmit();// 刷新查询
      }else{
        message.error('编辑失败')
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

          {/*<Form.Item<FieldType>
            label="用户id"
            name="id"
          >
            <Input defaultValue={originValue.id} disabled='true'/>
          </Form.Item>*/}

          <Form.Item<FieldType>
            label="账号"
            name="name"
          >
            <Input defaultValue={originValue.name} disabled='true'/>
          </Form.Item>

          <Form.Item<FieldType>
            label="姓名"
            name="displayName"
          >
            <Input defaultValue={originValue.displayName}/>
          </Form.Item>

          <Form.Item<FieldType>
            label="请输入新密码"
            name="password"
          >
            <Input.Password placeholder="请于此处填写新密码，若未填写则不修改密码"/>
          </Form.Item>

          {/*<Form.Item<FieldType>
            label="请确认新密码"
            name="password_verify"
            dependencies={['password']}
            required
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('新密码与确认新密码不同！');
                },
              }),
            ]}
          >
            <Input.Password/>
          </Form.Item>*/}

          <Form.Item<FieldType>
            label="邮箱"
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
