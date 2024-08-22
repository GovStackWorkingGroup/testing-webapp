import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import React from 'react';

interface DataProtectionNoticeProps {
  content: string;
}

const DataProtectionNotice: React.FC<DataProtectionNoticeProps> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const customPath = path.join(process.cwd(), 'content', 'custom', 'data-protection-notice.html');
  const templatePath = path.join(process.cwd(), 'content', 'template', 'data-protection-notice.html');

  let contentPath = templatePath;

  if (fs.existsSync(customPath)) {
    contentPath = customPath;
  }

  const content = fs.readFileSync(contentPath, 'utf8');

  return {
    props: {
      content,
    },
  };
};

export default DataProtectionNotice;
