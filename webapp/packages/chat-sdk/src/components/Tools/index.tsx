import { isMobile } from '../../utils/utils';
import { Button, Input, Popover, message } from 'antd';
import { DislikeOutlined, LikeOutlined } from '@ant-design/icons';
import { CLS_PREFIX } from '../../common/constants';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { updateQAFeedback } from '../../service';

type Props = {
  queryId: number;
  scoreValue?: number;
  isLastMessage?: boolean;
};

const Tools: React.FC<Props> = ({ queryId, scoreValue, isLastMessage }) => {
  const [score, setScore] = useState(scoreValue || 0);
  const [likeTag, setLikeTag] = useState(false);
  const [disLikeTag, setDisLikeTag] = useState(false);
  const [suggestContent, setSuggestContent] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [popState, setPopState] = useState(false);
  // const [destroyOr, setDestoryOr] = useState(false);
  const prefixCls = `${CLS_PREFIX}-tools`;
  const { TextArea } = Input;

  useEffect(() => {
    if (score === 0) {
      setLikeTag(false);
    } else if (score === 5) {
      setLikeTag(true);
    } else if (score === 1) {
      setDisLikeTag(true);
    }
  }, [score]);

  const like = () => {
    if (!likeTag) {
      setLikeTag(true);
      setScore(5);
      updateQAFeedback(queryId, 5);
    } else if (likeTag) {
      setLikeTag(false);
      setScore(0);
      updateQAFeedback(queryId, 0);
    }
  };

  const dislike = () => {
    if (!disLikeTag) {
      setDisLikeTag(true);
      setScore(1);
      updateQAFeedback(queryId, 1, '');
    } else if (disLikeTag) {
      setDisLikeTag(false);
      setScore(0);
      updateQAFeedback(queryId, 0, '');
      setPopState(true);
    }
  };

  const handleSubmit = () => {
    updateQAFeedback(queryId, 1, suggestContent);
    messageApi.open({
      type: 'success',
      content: '意见反馈成功',
      style: {
        marginTop: '20vh',
      },
    });
  }

  const likeClass = classNames(`${prefixCls}-like`, {
    [`${prefixCls}-feedback-active`]: score === 5,
  });
  const dislikeClass = classNames(`${prefixCls}-dislike`, {
    [`${prefixCls}-feedback-active`]: score === 1,
  });

  return (
    <div className={prefixCls}>
      {contextHolder}
      {!isMobile && (
        <div className={`${prefixCls}-feedback`}>
          <div>这个回答正确吗？</div>
          <LikeOutlined className={likeClass} onClick={like} />
          <Popover
            placement="rightTop"
            onOpenChange={(r) => { setPopState(r);  }}
            fresh
            content={
              <div style={{ textAlign: "right" }}>
                <TextArea
                  rows={2}
                  placeholder="请在此处简要描述您的意见"
                  onChange={(e) => { setSuggestContent(e.target.value) }}
                />
                <Button
                  type="primary"
                  style={{ marginTop: "5px", right: 0 }}
                  onClick={handleSubmit}
                >
                  提交
                </Button>
              </div>
            }
            trigger={`${disLikeTag ? "hover" : popState ? "hover" : "click"}`}
          >
            <DislikeOutlined
              className={dislikeClass}
              onClick={e => {
                e.stopPropagation();
                dislike();
              }}
            />
          </Popover>
        </div>
      )}
    </div>
  );
};

export default Tools;
