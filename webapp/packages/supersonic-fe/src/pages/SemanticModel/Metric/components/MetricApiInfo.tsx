import React from 'react';
import ReactJson from 'react-json-view'
import { useSelector } from 'react-redux'

type Props = {
    load: any;
}


const MetricApiInfo: React.FC<Props> = ({ load }) => {
    let mockJson = useSelector((state:any) => state.message.message);
    if(!load){
        mockJson = {}
    }
    return (
        <div style={{padding: '20px'}}>
            <div style={{padding: '20px', backgroundColor: 'white', borderRadius: '6px'}}><span style={{backgroundColor: '#aee1ca', borderRadius: '6px', padding: '3px', marginRight: '5px', fontWeight: '600'}}>POST</span>/api/semantic/query/metric</div>
            <div style={{padding: '20px', fontWeight: '600'}}>Response</div>
            {Object.keys(mockJson).length != 0 && <ReactJson src={mockJson} displayDataTypes={false} theme="google" style={{borderRadius: '6px', padding: '20px'}} />}
            {Object.keys(mockJson).length == 0 && <p style={{padding: '20px', backgroundColor: 'white', borderRadius: '6px'}}>暂无返回数据，请先在“指标探索”标签中查询</p>}
        </div>
    );
};

export default MetricApiInfo;