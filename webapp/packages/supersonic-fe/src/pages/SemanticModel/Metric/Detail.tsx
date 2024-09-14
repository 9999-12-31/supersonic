import { message, Tabs, Button, Space } from 'antd';
import React, { useState, useEffect, act } from 'react';
import { getMetricData, getDimensionList, getDrillDownDimension } from '../service';
import { useParams, history } from '@umijs/max';
import styles from './style.less';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MetricTrendSection from '@/pages/SemanticModel/Metric/components/MetricTrendSection';
import { ISemantic } from '../data';
import MetricBasicInfo from './components/MetricBasicInfo';
import MetricApiInfo from './components/MetricApiInfo';
import DimensionAndMetricRelationModal from '../components/DimensionAndMetricRelationModal';
import MetricInfoSider from './MetricInfoSider';
import type { TabsProps } from 'antd';
import { Provider } from 'react-redux';
import store from '../../../store';

type Props = Record<string, any>;

const MetricDetail: React.FC<Props> = () => {
  const params: any = useParams();
  const metricId = params.metricId;
  const [metricRelationModalOpenState, setMetricRelationModalOpenState] = useState<boolean>(false);
  const [metircData, setMetircData] = useState<ISemantic.IMetricItem>();
  const [dimensionList, setDimensionList] = useState<ISemantic.IDimensionItem[]>([]);
  const [drillDownDimension, setDrillDownDimension] = useState<ISemantic.IDrillDownDimensionItem[]>(
    [],
  );
  const [relationDimensionOptions, setRelationDimensionOptions] = useState<
    { value: string; label: string; modelId: number }[]
  >([]);
  const [load, setLoad] = useState<boolean>(false)

  useEffect(() => {
    queryMetricData(metricId);
    queryDrillDownDimension(metricId);
  }, [metricId]);

  const queryMetricData = async (metricId: string) => {
    const { code, data, msg } = await getMetricData(metricId);
    if (code === 200) {
      setMetircData({ ...data });
      return;
    }
    message.error(msg);
  };

  const queryDrillDownDimension = async (metricId: number) => {
    const { code, data, msg } = await getDrillDownDimension(metricId);
    if (code === 200 && Array.isArray(data)) {
      setDrillDownDimension(data);
      const ids = data.map((item) => item.dimensionId);
      queryDimensionList(ids);
      return data;
    } else {
      setDimensionList([]);
      setRelationDimensionOptions([]);
    }
    if (code !== 200) {
      message.error(msg);
    }
    return [];
  };

  const queryDimensionList = async (ids: number[]) => {
    if (!(Array.isArray(ids) && ids.length > 0)) {
      setRelationDimensionOptions([]);
      return;
    }
    const { code, data, msg } = await getDimensionList({ ids });
    if (code === 200 && Array.isArray(data?.list)) {
      setDimensionList(data.list);
      setRelationDimensionOptions(
        data.list.map((item: ISemantic.IMetricItem) => {
          return { label: item.name, value: item.bizName, modelId: item.modelId };
        }),
      );
      return data.list;
    }
    message.error(msg);
    return [];
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'metricCaliberInput',
      label: '基础信息',
      children: <MetricBasicInfo metircData={metircData} onQueryMetricData={queryMetricData} />,
    },
    {
      key: 'metricTrend',
      label: '指标探索',
      children: (
        <MetricTrendSection
          metircData={metircData}
          relationDimensionOptions={relationDimensionOptions}
          dimensionList={dimensionList}
        />
      ),
    },
    {
      key: 'metricApi',
      label: '接口参数',
      children: <MetricApiInfo load={load} />,
    },
  ];

  return (
    <Provider store={store}>
      <div className={styles.metricDetailWrapper}>
        <div className={styles.metricDetail}>
          {/*<div className={styles.siderContainer}>*/}
          <div style={{width: '400px'}}>
            <MetricInfoSider
              relationDimensionOptions={relationDimensionOptions}
              metircData={metircData}
              onDimensionRelationBtnClick={() => {
                setMetricRelationModalOpenState(true);
              }}
            />
          </div>
          <div className={styles.tabContainer}>
            <Tabs
              defaultActiveKey="metricCaliberInput"
              items={tabItems}
              onChange={(activeKey: string)=>{
                if(activeKey == 'metricTrend' && !load){
                  setLoad(true)
                }
              }}
              tabBarExtraContent={{
                right: (
                  <Button
                    size="middle"
                    type="link"
                    key="backListBtn"
                    onClick={() => {
                      history.push('/metric/market');
                    }}
                  >
                    <Space>
                      <ArrowLeftOutlined />
                      返回列表页
                    </Space>
                  </Button>
                ),
              }}
              size="large"
              className={styles.metricDetailTab}
            />
          </div>

        </div>
        <DimensionAndMetricRelationModal
          metricItem={metircData}
          relationsInitialValue={drillDownDimension}
          open={metricRelationModalOpenState}
          onCancel={() => {
            setMetricRelationModalOpenState(false);
          }}
          onSubmit={(relations) => {
            queryMetricData(metricId);
            queryDrillDownDimension(metricId);
            setMetricRelationModalOpenState(false);
          }}
        />
      </div>
    </Provider>
  );
};

export default MetricDetail;
