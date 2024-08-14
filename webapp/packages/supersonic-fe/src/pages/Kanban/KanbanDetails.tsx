import { Tabs, Breadcrumb, Space, Radio } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { useModel } from '@umijs/max';
import styles from './style.less';
import { HomeOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import TabViews from './TabViews';
import { queryAgentList } from '../../../../chat-sdk/src/Chat/service'

type Props = {
    activeKey: number;
};
const KanbanDetails: React.FC<Props> = ({
    activeKey,
}) => {
    const [tabKey, setTabKey] = useState(0);
    const [tabData, setTabData] = useState({});

    const initAgentList = async () => {
        const res = await queryAgentList();
        const agentListValue = (res.data || []).filter(
            item => item.status
        );
        setTabData(agentListValue)
    };

    useEffect(() => {
        initAgentList();
    }, []);
    
    const items = Object.values(tabData).map((val: any, index) =>
        [
            {
                key: val.id,
                label: val.name,
                children: <TabViews activeKey={activeKey} tabKey={val.id} />,
            }
        ]
    ).reduce(function (a, b) {
        return a.concat(b);
    }, []);

    const modelModel = useModel('SemanticModel.modelData');
    const { selectModelId, selectModelName } = modelModel;

    return (
        <div>
            <Breadcrumb
                className={styles.breadcrumb}
                separator=""
                items={[
                    {
                        title: (
                            <Space
                                style={
                                    selectModelName ? { cursor: 'pointer' } : { color: '#296df3', fontWeight: 'bold' }
                                }
                            >
                                <HomeOutlined />
                                <span style={{ marginLeft: "5px" }}>{activeKey == 1 ? "用户点赞案例" : "用户点踩案例"}</span>
                            </Space>
                        ),
                    },

                ]}
            />
            <Tabs
                className={styles.tab}
                items={items}
                // activeKey={getActiveKey()}
                // tabBarExtraContent={{
                //     right:
                //
                // }}
                size="large"
                onChange={(key: any) => {
                    setTabKey(key);
                }}
            />
        </div>
    );
};

export default KanbanDetails;
