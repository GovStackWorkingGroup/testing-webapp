import Link from 'next/link';
type BackToPageProps = {
  text: string;
  href?: string | URL;
  goBack?: boolean;
};

const BackToPageButton = ({ text, href, goBack }: BackToPageProps) => {
  const handleGoBack = () => {
    if (goBack) {
      history.back();
    }
  };

  return (
    <div className="back-to-btn" onClick={() => handleGoBack()}>
      {href && <Link href={href}>{text}</Link>}
      {goBack && <a>{text}</a>}
    </div>
  );
};

export default BackToPageButton;
