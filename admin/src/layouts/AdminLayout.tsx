import { Layout, Menu, Typography } from 'antd';
import {
  BuildOutlined,
  FolderOutlined,
  GiftOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Գլխավոր',
  },
  {
    key: '/cakes',
    icon: <GiftOutlined />,
    label: 'Տորթեր',
  },
  {
    key: '/categories',
    icon: <FolderOutlined />,
    label: 'Կատեգորիաներ',
  },
  {
    key: '/components',
    icon: <BuildOutlined />,
    label: 'Բաղադրիչներ',
  },
  {
    key: '/orders',
    icon: <ShoppingCartOutlined />,
    label: 'Պատվերներ',
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth={0} width={240}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
          }}
        >
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            Տորթերի Ադմին
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            Կառավարման վահանակ
          </Typography.Title>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
