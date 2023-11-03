import Link from 'next/link';
type BackToPageProps = {
  text: string;
  href: string | URL;
};

const BackToPageButton = ({ text, href }: BackToPageProps) => (
  <div className="back-to-btn">
    <Link href={href}>{text}</Link>
  </div>
);

export default BackToPageButton;
