import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Popconfirm, Switch, Table, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './style.less';
import { AgentType } from './type';
import { right } from '@antv/x6/lib/registry/port-layout/line';
import CodeBlock from './CodeBlock';
import Icon, { CloudDownloadOutlined } from '@ant-design/icons';

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
  const [nowMethod, setNowMethod] = useState(0);

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

    const currentUrl = window.location.href;


    const codeContentList = [
      `
      <iframe
        src="http://${currentUrl.split("/")[2]}/chat/external"
        style={{ border: "none" }}
      />
      `,
      `
      1.进入到/webapp/packages/chat-sdk 目录，修改 package.json
        {
          "name": "xxx-chat-sdk",
          "version": "x.x.x",
          ...
        }
      2.执行npm run build
      3.执行npm publish，将组件发布到 npm 仓库
      4.在 react 前端项目执行npm install xxx-chat-sdk
      5.在 react 前端项目中引入 chat-sdk 包
        import { Chat } from 'xxx-chat-sdk';
        const ChatPage = () => {
          return (
            <Chat token="xxx" />
          );
        };
        export default ChatPage;
      `,
      `
      插件安装步骤
      1.解压rar压缩包
      2.在谷歌浏览器中“管理扩展程序”页面中打开“开发者选项”
      3.将解压后插件文件夹拖拽至谷歌浏览器“管理扩展程序”页面
      4.完成安装
      `
    ]

    const titleList = [
      // `将以下 iframe 嵌入到你的网站中的目标位置`,
      // `将问答对话页集成到业务系统中`,
      // `安装Chrome浏览器扩展`
      {
        label: `将以下 iframe 嵌入到你的网站中的目标位置`,
        key: `1`,
      },
      {
        label: `将问答对话页集成到业务系统中`,
        key: `2`,
      },
      {
        label: `安装Chrome浏览器扩展`,
        key: `3`,
      }
    ]


    const onChange = (key: string) => {
      // console.log(parseInt(key));
      setNowMethod(parseInt(key)-1)
    };
    


  return (
    <div className={styles.agentsSection}>
      <div className={styles.content}>
        <div className={styles.searchBar}>
          <Button onClick={handleButtonClick}>嵌入到网站中</Button>
          {/* <Button onClick={handleButtonClick}><a href={require('../../../public/ChatBI-chrome-plugin.rar')} download>嵌入到网站中</a></Button> */}
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
              zIndex: 99,
              }}
              onClick={closeModal}>
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                }} 
                onClick={(e) => e.stopPropagation()}>
                <h2>嵌入到网站中</h2>
                <h4>选择一种方式将聊天应用嵌入到你的网站中</h4>
                <Tabs
                  onChange={onChange}
                  type="card"
                  items = {titleList}
                  style={{ marginTop: '20px', marginBottom: '-10px' }}
                />
                {/* <div style={{display: 'flex', height: '60px', alignItems: 'center', justifyContent: 'space-around'}}>
                  <Button type={nowMethod==0?"primary":"default"} onClick={()=>setNowMethod(0)}>iframe嵌入</Button>
                  <Button type={nowMethod==1?"primary":"default"} onClick={()=>setNowMethod(1)}>npm组件包集成</Button>
                  <Button type={nowMethod==2?"primary":"default"} onClick={()=>setNowMethod(2)}>浏览器扩展</Button>
                </div> */}
                {nowMethod==2 && 
                <div style={{width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Button style={{width: '100%', margin: '5px'}} type="primary"><a href={require('../../../public/ChatBI-chrome-plugin.rar')} download><CloudDownloadOutlined />&nbsp;下载Chrome浏览器扩展</a></Button>
                </div>
                }
                <CodeBlock codeContent={codeContentList[nowMethod]} title={titleList[nowMethod].label}/>
                <Button onClick={closeModal} style={{ float: 'right', marginTop: '10px' }} >关闭弹窗</Button>
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
