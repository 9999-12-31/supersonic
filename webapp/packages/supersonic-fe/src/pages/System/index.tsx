import './sysCss.less';
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
import React, { useState, useEffect, useRef } from 'react';
import { getSystemConfig, saveSystemConfig, dependenciesItem } from '@/services/user';
import { ProCard } from '@ant-design/pro-components';
import SelectTMEPerson from '@/components/SelectTMEPerson';
import { ConfigParametersItem, SystemConfig } from './types';
import FormItemTitle from '@/components/FormHelper/FormItemTitle';
import { groupBy } from 'lodash';
import { genneratorFormItemList } from '../SemanticModel/utils';
// import UserTable from './userManage'
import { Point } from '@antv/x6';

const FormItem = Form.Item;
type Admin = string[];
const { TextArea } = Input;
const System: React.FC = () => {
  const [systemConfig, setSystemConfig] = useState<Record<string, ConfigParametersItem[]>>({});
  const [anchorItems, setAnchorItems] = useState<{ key: string; href: string; title: string }[]>(
    [],
  );
  const [configSource, setConfigSource] = useState<SystemConfig>();
  // 显示用户管理或功能配置状态切换
  const [showState, setShowState ] = useState(1);

  const configMap = useRef<Record<string, ConfigParametersItem>>();

  const configIocDepMap = useRef<Record<string, any>>();
  // const [configIocDepMap, setConfigIocDepMap] = useState<any>({});

  useEffect(() => {
    querySystemConfig();
  }, []);
  const [form] = Form.useForm();
  const querySystemConfig = async () => {
    const { code, data, msg } = await getSystemConfig();

    if (code === 200 && data) {
      const { parameters = [], admins = [] } = data;

      const parametersMap = parameters.reduce(
        (configReduceMap: Record<string, ConfigParametersItem>, item: ConfigParametersItem) => {
          return {
            ...configReduceMap,
            [item.name]: item,
          };
        },
        {},
      );

      configMap.current = parametersMap;

      groupConfigAndSet(parameters);

      initDepConfig(parameters, admins);

      setConfigSource(data);
    } else {
      message.error(msg);
    }
  };

  const initDepConfig = (parameters: ConfigParametersItem[], admins: Admin) => {
    const iocMap = getDepIoc(parameters);
    configIocDepMap.current = iocMap;
    const initFormValues = setInitData(admins, parameters);
    Object.keys(initFormValues).forEach((itemName) => {
      const targetDep = iocMap[itemName] || {};
      const excuteStack = Object.values(targetDep);
      if (Array.isArray(excuteStack)) {
        excuteDepConfig(itemName, initFormValues, true);
      }
    });
  };

  const groupConfigAndSet = (parameters: ConfigParametersItem[]) => {
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
  };

  const getDepIoc = (parameters: ConfigParametersItem[]) => {
    const iocMap: Record<string, Record<string, ConfigParametersItem>> = {};
    parameters.forEach((item) => {
      const { name: itemName, dependencies } = item;
      if (Array.isArray(dependencies)) {
        dependencies.forEach((depItem) => {
          const { name } = depItem;

          if (iocMap[name]) {
            iocMap[name] = {
              ...iocMap[name],
              [itemName]: item,
            };
          } else {
            iocMap[name] = {
              [itemName]: item,
            };
          }
        });
      }
    });
    return iocMap;
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
    return fieldsValue;
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

  const excuteDepConfig = (
    itemName: string,
    formValues: Record<string, any>,
    isInit: boolean = false,
  ) => {
    const targetDep = configIocDepMap?.current?.[itemName];
    if (!targetDep) {
      return;
    }
    const excuteStack = Object.values(targetDep);
    if (!Array.isArray(excuteStack)) {
      return;
    }
    const tempConfigMap: any = { ...configMap.current };
    const currentFormValues = formValues;

    excuteStack.forEach((configItem: any) => {
      const showStateList: boolean[] = [];
      const hasValueFieldsSetDefaultValueList: any[] = [];
      const { dependencies, name: configItemName } = configItem;
      dependencies.forEach((item: dependenciesItem) => {
        const { name, setDefaultValue } = item;
        const currentDepValue = currentFormValues[name];
        const showIncludesValue = item.show?.includesValue;
        if (Array.isArray(showIncludesValue)) {
          showStateList.push(showIncludesValue.includes(currentDepValue));
        }
        if (setDefaultValue && currentDepValue) {
          hasValueFieldsSetDefaultValueList.push({
            excuteItem: configItemName,
            ...item,
          });
        }
      });

      const visible = showStateList.every((item) => item);
      tempConfigMap[configItemName].visible = visible;
      const lastSetDefaultValueItem =
        hasValueFieldsSetDefaultValueList[hasValueFieldsSetDefaultValueList.length - 1];
      const lastSetDefaultValue = lastSetDefaultValueItem?.setDefaultValue;

      if (lastSetDefaultValue) {
        const targetValue = lastSetDefaultValue[currentFormValues[lastSetDefaultValueItem.name]];
        if (targetValue && !isInit) {
          form.setFieldValue(lastSetDefaultValueItem.excuteItem, targetValue);
        }
      }
    });

    groupConfigAndSet(Object.values(tempConfigMap));
  };


  return (
    <>
       <div style={{ margin: '0 auto' }}>
          <div style={{ background: '#fff', width: '15%', height: '1000px', position: 'fixed', boxShadow: '0.5px 0.5px 3px grey'}}>
            <div style={{ marginTop: 1 }}>
              <Anchor items={anchorItems} style={{ marginTop: 10 }}/>
            </div>
          </div>

          <div style={{ width: '84%', float: 'right' }}>
            <div style={{background: '#fff', minHeight: '18vh', marginBottom: '10px', overflow: 'auto'}}>
              <Form form={form} layout="vertical" style={{padding:'20px'}}>
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
              {/*{showUser(showState)}*/}
            </div>

            <div style={{background: '#fff', height: '60vh', overflow:'auto'}} className={'rightBottom'}>
              <ProCard
                title=""
                extra={
                  <Space>
                  </Space>
                }
              >
                <Form form={form} layout="vertical">
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
                          {genneratorFormItemList(itemList, form)}
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
