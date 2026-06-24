import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Order, OrderStatus } from '../types/api';
import { ordersApi } from '../api/resources';
import { orderStatusLabels, orderTypeLabels } from '../utils/labels';

const statusColors: Record<OrderStatus, string> = {
  pending: 'gold',
  confirmed: 'blue',
  completed: 'green',
  cancelled: 'red',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await ordersApi.getAll());
    } catch {
      message.error('Չհաջողվեց բեռնել պատվերները');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      message.success('Կարգավիճակը թարմացվեց');
      loadOrders();
    } catch {
      message.error('Կարգավիճակի թարմացումը ձախողվեց');
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Հաճախորդ',
      key: 'customer',
      render: (_, record) => record.customer.name,
    },
    {
      title: 'Հեռախոս',
      key: 'phone',
      render: (_, record) => record.customer.phone,
    },
    {
      title: 'Տեսակ',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (orderType: Order['orderType']) => orderTypeLabels[orderType],
    },
    {
      title: 'Կարգավիճակ',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          options={Object.entries(orderStatusLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          onChange={(value) => handleStatusChange(record._id, value as OrderStatus)}
        />
      ),
    },
    {
      title: 'Ամսաթիվ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value?: string) =>
        value ? new Date(value).toLocaleString('hy-AM') : '—',
    },
    {
      title: 'Գործողություններ',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" onClick={() => setSelectedOrder(record)}>
          Մանրամասներ
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Պատվերներ
        </Typography.Title>
        <Button onClick={loadOrders}>Թարմացնել</Button>
      </Space>

      <Table rowKey="_id" loading={loading} columns={columns} dataSource={orders} />

      <Modal
        title="Պատվերի մանրամասներ"
        open={Boolean(selectedOrder)}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={720}
      >
        {selectedOrder && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{selectedOrder._id}</Descriptions.Item>
            <Descriptions.Item label="Տեսակ">
              <Tag>{orderTypeLabels[selectedOrder.orderType]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Կարգավիճակ">
              <Tag color={statusColors[selectedOrder.status]}>
                {orderStatusLabels[selectedOrder.status]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Հաճախորդ">
              {selectedOrder.customer.name}
            </Descriptions.Item>
            <Descriptions.Item label="Հեռախոս">
              {selectedOrder.customer.phone}
            </Descriptions.Item>
            {selectedOrder.customer.email && (
              <Descriptions.Item label="Email">
                {selectedOrder.customer.email}
              </Descriptions.Item>
            )}
            {selectedOrder.customer.address && (
              <Descriptions.Item label="Հասցե">
                {selectedOrder.customer.address}
              </Descriptions.Item>
            )}
            {selectedOrder.deliveryDate && (
              <Descriptions.Item label="Առաքման ամսաթիվ">
                {new Date(selectedOrder.deliveryDate).toLocaleString('hy-AM')}
              </Descriptions.Item>
            )}
            {selectedOrder.totalPrice !== undefined && (
              <Descriptions.Item label="Գին">
                {selectedOrder.totalPrice.toLocaleString('hy-AM')} դր
              </Descriptions.Item>
            )}
            {selectedOrder.notes && (
              <Descriptions.Item label="Նշումներ">
                {selectedOrder.notes}
              </Descriptions.Item>
            )}

            {selectedOrder.orderType === 'custom' && selectedOrder.customSelections && (
              <>
                <Descriptions.Item label="Հարկեր">
                  {selectedOrder.customSelections.tier?.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Չափս">
                  {selectedOrder.customSelections.size
                    ? `${selectedOrder.customSelections.size.name} (${selectedOrder.customSelections.size.guestRange})`
                    : '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Միջուկ">
                  {selectedOrder.customSelections.filling?.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Մրգեր">
                  {selectedOrder.customSelections.fruit?.name ?? '—'}
                </Descriptions.Item>
                <Descriptions.Item label="Ընդեղեն">
                  {selectedOrder.customSelections.nut?.name ?? '—'}
                </Descriptions.Item>
              </>
            )}

            {selectedOrder.orderType === 'catalog' && selectedOrder.cake && (
              <Descriptions.Item label="Տորթ">
                {selectedOrder.cake.name}
                {selectedOrder.quantity ? ` × ${selectedOrder.quantity}` : ''}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
}
