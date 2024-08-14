import React, { useState, useEffect } from 'react';
import styles from './style.less';
import { queryShowCase } from '../../../../chat-sdk/src/ShowCase/service';
import Text from '../../../../chat-sdk/src/Chat/components/Text';
import ChatItem from '../../../../chat-sdk/src/components/ChatItem/index';
import { Empty, Card } from 'antd';

type Props = {
    activeKey: number,
    tabKey: number
};

const TabViews: React.FC<Props> = ({ activeKey, tabKey }) => {

    const [showCaseList, setShowCaseList] = useState([]);
    const [isQuesting, setIsQuesting] = useState(false);

    const updateData =
        async (pageNoValue: number) => {
            const res = activeKey === 1
                ?
                await queryShowCase(tabKey, pageNoValue, 20, 5)
                :
                await queryShowCase(tabKey, pageNoValue, 20, 1);
            const showCaseMapRes: any = res?.data?.showCaseMap || {};
            const list = Object.keys(showCaseMapRes)
                .reduce((result: any, key: string) => {
                    result.push({ msgList: showCaseMapRes[key], caseId: key });
                    return result;
                }, [])
                .sort((a: any, b: any) => {
                    return (b.msgList?.[0]?.score || 3) - (a.msgList?.[0]?.score || 3);
                });
            setShowCaseList(pageNoValue === 1 ? list : [...showCaseList, ...list]);
        };
    useEffect(() => {
        if (tabKey) {
            try {
                setIsQuesting(true)
                setShowCaseList([]);
                updateData(1);
            } finally {
                setIsQuesting(false);
            }
            // setPageNo(1);
        }
    }, [tabKey, activeKey]);
    return (
        <div className={styles.showCaseContent}>
            {showCaseList.length === 0 && !isQuesting ? <Empty className={styles.emptyContent} description="暂无案例反馈" /> :
                showCaseList.map((showCaseItem: any) => {  
                    return (
                        <div key={showCaseItem.caseId} className={styles.showCaseItem}>
                            {showCaseItem.msgList
                                .filter((chatItem: any) => !!chatItem.queryResult)
                                // .slice(0, 1)
                                .map((chatItem: any) => {
                                    console.log('qqqqq', chatItem)
                                    return (
                                        <div className={styles.showCaseChatItem} key={chatItem.questionId}>
                                            <Text position="right" data={chatItem.queryText} anonymousUser />
                                            <ChatItem
                                                msg={chatItem.queryText}
                                                parseInfos={chatItem.parseInfos}
                                                msgData={chatItem.queryResult}
                                                conversationId={chatItem.chatId}
                                                agentId={tabKey}
                                                integrateSystem="showcase"
                                                score={chatItem.score}
                                                onSendMsg={(msg: string) => { }}
                                            />
                                            {
                                                chatItem.score === 1
                                                    ?
                                                    <Card
                                                        style={{ maxWidth: "calc(100% - 50px)", marginLeft: "40px" }}
                                                        title="用户建议反馈"
                                                    >
                                                        {chatItem.feedback}
                                                    </Card>
                                                    :
                                                    ""
                                            }
                                        </div>
                                    );
                                })}
                        </div>
                    );
                })}
        </div >
    )
}

export default TabViews;
