import { isMobile } from '../../utils/utils';
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
  const prefixCls = `${CLS_PREFIX}-tools`;

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
      updateQAFeedback(queryId, 1);
    } else if (disLikeTag) {
      setDisLikeTag(false);
      setScore(0);
      updateQAFeedback(queryId, 0);
    }
  };

  const likeClass = classNames(`${prefixCls}-like`, {
    [`${prefixCls}-feedback-active`]: score === 5,
  });
  const dislikeClass = classNames(`${prefixCls}-dislike`, {
    [`${prefixCls}-feedback-active`]: score === 1,
  });

  return (
    <div className={prefixCls}>
      {!isMobile && (
        <div className={`${prefixCls}-feedback`}>
          <div>这个回答正确吗？</div>
          <LikeOutlined className={likeClass} onClick={like} />
          <DislikeOutlined
            className={dislikeClass}
            onClick={e => {
              e.stopPropagation();
              dislike();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tools;
