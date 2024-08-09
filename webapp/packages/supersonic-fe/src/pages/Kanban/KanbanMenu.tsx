import { Menu } from 'antd';
import { useState } from 'react';
import { DislikeOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './style.less';
import KanbanDetails from './KanbanDetails';

const KanbanMenu = ({
}) => {
    type MenuItem = Required<MenuProps>['items'][number];
    const items: MenuItem[] = [
        { key: '1', icon: <LikeOutlined />, label: '用户点赞案例' },
        { key: '2', icon: <DislikeOutlined />, label: '用户点踩案例' },
    ];
    const [menuKey, setMenuKey] = useState(1);

    return (
        <div className={styles.projectBody}>
            <div className={styles.projectManger}>
                <div className={`${styles.sider}`}>
                    <div className={styles.treeContainer}>
                        <div className={styles.treeTitle}>
                            <CommentOutlined />
                            <span style={{ marginLeft: "10px" }}>案 例 看 板</span>
                        </div>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['231']}
                            style={{ width: 246, fontSize: "15px", lineHeight: "20px" }}
                            className={styles.menuTree}
                            items={items}
                            onClick={(res: any) => { setMenuKey(res.key) }}
                        />
                    </div>
                </div>
                <div className={styles.content}>
                    <KanbanDetails activeKey={Number(menuKey)} />
                </div>
            </div>
        </div>
    );
};

export default KanbanMenu;
