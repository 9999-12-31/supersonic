import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'antd';
import Icon, { CopyOutlined, CheckOutlined } from '@ant-design/icons';

export default function CodeBlock({ codeContent, title }: { codeContent: string, title?: string }){
  const [copied, setCopied] = useState(false);
  useEffect(()=>{
    setTimeout(()=>{
      setCopied(false)
    },3000)
  }, [copied])
  return (
    <div style={{width: '100%', border: '1px solid whitesmoke', borderRadius: '5px'}}>
      <div style={{height: '40px', width: '100%', backgroundColor: 'whitesmoke', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <span style={{fontSize: '14px', marginLeft: '8px'}}>{title}</span>
        <CopyToClipboard text={codeContent} onCopy={() => setCopied(true)}>
          <Button style={{cursor: 'pointer', fontSize: '10px', marginRight: '8px'}}  icon={copied?<CheckOutlined />:<CopyOutlined />}></Button>
        </CopyToClipboard>
      </div>
      <pre style={{textAlign: 'left', fontSize: '14px'}}><code>{codeContent}</code></pre>
    </div>
  )
}