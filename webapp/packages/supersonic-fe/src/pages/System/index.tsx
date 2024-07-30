import styles from './style.less';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Switch,
  Select,
  Divider,
  Anchor,
  Row,
  Col,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { getSystemConfig, saveSystemConfig } from '@/services/user';
import { ProCard } from '@ant-design/pro-components';
import SelectTMEPerson from '@/components/SelectTMEPerson';
import { ConfigParametersItem, SystemConfig } from './types';
import FormItemTitle from '@/components/FormHelper/FormItemTitle';
import { groupBy, size } from 'lodash';
import { genneratorFormItemList } from '../SemanticModel/utils';
import { index } from '@antv/x6/lib/util/dom/elem';
import SizeContext from 'supersonic-insights-flow-components/dist/common/config-provider/SizeContext';

const FormItem = Form.Item;
const { TextArea } = Input;
const System: React.FC = () => {
  const [systemConfig, setSystemConfig] = useState<Record<string, ConfigParametersItem[]>>({});
  const [anchorItems, setAnchorItems] = useState<{ key: string; href: string; title: string }[]>(
    [],
  );
  const [configSource, setConfigSource] = useState<SystemConfig>();

  useEffect(() => {
    querySystemConfig();
  }, []);
  const [form] = Form.useForm();
  const querySystemConfig = async () => {
    const { code, data, msg } = await getSystemConfig();
    if (code === 200 && data) {
      const { parameters = [], admins = [] } = data;
      const groupByConfig = groupBy(parameters, 'module');
      const anchor = Object.keys(groupByConfig).map((key: string) => {
        return {
          key,
          href: `#${key}`,
          title: key,
        };
      });
      setAnchorItems(anchor);
      setSystemConfig(groupByConfig);
      setInitData(admins, parameters);
      setConfigSource(data);
    } else {
      message.error(msg);
    }
  };

  const setInitData = (admins: string[], systemConfigParameters: ConfigParametersItem[]) => {
    const fieldsValue = systemConfigParameters.reduce(
      (fields, item) => {
        const { name, value } = item;
        return {
          ...fields,
          [name]: value,
        };
      },
      { admins },
    );
    form.setFieldsValue(fieldsValue);
  };

  const querySaveSystemConfig = async () => {
    const submitData = await form.validateFields();
    const { code, msg } = await saveSystemConfig({
      ...configSource,
      admins: submitData.admins,
      parameters: configSource!.parameters.map((item) => {
        const { name } = item;
        if (submitData[name] !== undefined) {
          return {
            ...item,
            value: submitData[name],
          };
        }
        return item;
      }),
    });
    if (code === 200) {
      message.success('保存成功');
    } else {
      message.error(msg);
    }
  };

  return (
    <>
      <div style={{ margin: '0 auto' }}>
          <div style={{ background: '#fff', width: '15%', height: '1000px', position: 'fixed', boxShadow: '1px 1px 5px grey'}}>
            <div style={{ marginTop: 20 }}>
              <Anchor items={anchorItems} style={{ marginTop: 10 }}/>
            </div>
          </div>

          <div style={{ width: '84%', float: 'right' }}>

            <div style={{background: '#fff', height: '20vh', marginBottom: '10px'}}>
              <Form form={form} layout="vertical" className={styles.form} style={{padding:'20px'}}>
                <h2 style={{display:'inline-block'}}>系统设置</h2>
                <Button
                  type="primary"
                  onClick={() => {
                    querySaveSystemConfig();
                  }}
                  style={{ float: 'right' }}
                >
                  保 存
                </Button>
                <FormItem name="admins" label="管理员">
                  <SelectTMEPerson placeholder="请邀请团队成员"/>
                </FormItem>
              </Form>
            </div>

            <div style={{background: '#fff', height: '70vh', overflow:'auto'}}>
              <ProCard
                title=""
                extra={
                  <Space>
                  </Space>
                }
              >
                <Form form={form} layout="vertical" className={styles.form}>
                  <Space direction="vertical" style={{ width: '100%' }} size={35}>
                    {Object.keys(systemConfig).map((key: string) => {
                      const itemList = systemConfig[key];
                      return (
                        <ProCard
                          title={<span style={{ color: '#296df3' }}>{key}</span>}
                          key={key}
                          bordered
                          id={key}
                        >
                          {genneratorFormItemList(itemList)}
                        </ProCard>
                      );
                    })}
                  </Space>
                </Form>
              </ProCard>
            </div>
          </div>

      </div>
    </>
  );
};

export default System;
