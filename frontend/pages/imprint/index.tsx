import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import React from 'react';

interface ImprintProps {
  content: string;
}

const Imprint: React.FC<ImprintProps> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const customPath = path.join(process.cwd(), 'content', 'custom', 'imprint.html');
  const templatePath = path.join(process.cwd(), 'content', 'template', 'imprint.html');

  let contentPath = templatePath;

  if (fs.existsSync(customPath)) {
    contentPath = customPath;
  }

  let content: string;

  try {
    content = fs.readFileSync(contentPath, 'utf8');
  } catch (error: any) {
    content = '<div>Content not available.</div>';
    console.error(`Error reading file: ${error.message}`);
  }

  return {
    props: {
      content,
    },
  };
};

export default Imprint;
