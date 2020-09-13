import * as React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import { Layout, Menu } from 'antd';

export function Header(props: HeaderProps) {
  return (
    <Layout.Header title="Veronica">
      <div className="header">
        <h3 className="header-title"><Link to="/">Veronica</Link></h3>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1"><Link to="/runner">Runner</Link></Menu.Item>
        </Menu>
      </div>
    </Layout.Header>
  )
}

interface HeaderProps { }