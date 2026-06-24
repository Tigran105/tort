import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, message } from 'antd';
import { cakesApi, categoriesApi, ordersApi } from '../api/resources';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    cakes: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [cakes, categories, orders] = await Promise.all([
          cakesApi.getAll(),
          categoriesApi.getAll(),
          ordersApi.getAll(),
        ]);

        setStats({
          cakes: cakes.length,
          categories: categories.length,
          orders: orders.length,
          pendingOrders: orders.filter((order) => order.status === 'pending').length,
        });
      } catch {
        message.error('Չհաջողվեց բեռնել վիճակագրությունը');
      }
    }

    loadStats();
  }, []);

  return (
    <Card>
      <Typography.Title level={3}>Գլխավոր</Typography.Title>
      <Typography.Paragraph>
        Բարի գալուստ տորթերի խանութի կառավարման վահանակ։
      </Typography.Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Տորթեր" value={stats.cakes} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Կատեգորիաներ" value={stats.categories} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Պատվերներ" value={stats.orders} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Սպասող պատվերներ" value={stats.pendingOrders} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
}
