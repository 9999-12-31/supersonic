import { PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Table } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './style.less';
import { AgentType } from './type';
import { right } from '@antv/x6/lib/registry/port-layout/line';

type Props = {
  agents: AgentType[];
  loading: boolean;
  onSelectAgent: (agent: AgentType) => void;
  onDeleteAgent: (id: number) => void;

  onSaveAgent: (agent: AgentType, noTip?: boolean) => Promise<void>;
  onCreatBtnClick?: () => void;
};

const AgentsSection: React.FC<Props> = ({
  agents,
  onSelectAgent,
  onDeleteAgent,
  onSaveAgent,
  onCreatBtnClick,
}) => {
  const [showAgents, setShowAgents] = useState<AgentType[]>([]);
  // 使用useState来管理弹窗的显示状态
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setShowAgents(agents);
  }, [agents]);

  const columns = [
    {
      title: '助理名称',
      dataIndex: 'name',
      key: 'name',
      render: (value: string, agent: AgentType) => {
        return (
          <a
            onClick={() => {
              onSelectAgent(agent);
            }}
          >
            {value}
          </a>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number, agent: AgentType) => {
        return (
          <div className={styles.toggleStatus}>
            {status === 0 ? '已禁用' : <span className={styles.online}>已启用</span>}
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Switch
                size="small"
                defaultChecked={status === 1}
                onChange={(value) => {
                  onSaveAgent({ ...agent, status: value ? 1 : 0 }, true);
                }}
              />
            </span>
          </div>
        );
      },
    },
    {
      title: '更新人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      render: (_: any, agent: AgentType) => {
        return (
          <div className={styles.operateIcons}>
            <a
              onClick={() => {
                onSelectAgent(agent);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="确定删除吗？"
              onCancel={(e) => {
                e?.stopPropagation();
              }}
              onConfirm={() => {
                onDeleteAgent(agent.id!);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

    // 处理按钮点击的函数
    const handleButtonClick = () => {
      setIsModalOpen(!isModalOpen);
    };
  
    // 处理关闭弹窗的函数
    const closeModal = () => {
      setIsModalOpen(false);
    };


  return (
    <div className={styles.agentsSection}>
      <div className={styles.content}>
        <div className={styles.searchBar}>
          <Button onClick={handleButtonClick}><a href={require('../../../public/ChatBI-chrome-plugin.rar')} download>插件下载</a></Button>
          {isModalOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99
              }}
              onClick={closeModal}>
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                }} 
                onClick={(e) => e.stopPropagation()}>
                <h2>插件安装提示</h2>
                <p>1.解压rar压缩包</p>
                <p>2.在谷歌浏览器中“管理扩展程序”页面中打开“开发者选项”</p>
                <p>3.将解压后插件文件夹拖拽至谷歌浏览器“管理扩展程序”页面</p>
                <p>4.完成安装</p>
                <Button onClick={closeModal} style={{ float: 'right' }} >关闭弹窗</Button>
              </div>
            </div>
          )}
          <Button
            type="primary"
            onClick={() => {
              onCreatBtnClick?.();
            }}
          >
            <PlusOutlined />
            新建助理
          </Button>
        </div>
        <Table columns={columns} dataSource={showAgents} />
      </div>
    </div>
  );
};

export default AgentsSection;
