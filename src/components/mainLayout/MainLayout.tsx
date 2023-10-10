import React from 'react';
import Header from '../header/Header';

type MainLayoutProps = {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="main-layout">
    <Header/>
    {children}
  </div>
);

export default MainLayout;
