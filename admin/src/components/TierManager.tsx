import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Tier } from '../types/api';
import { tiersApi } from '../api/resources';
import { requiredRule } from '../utils/labels';

interface TierFormValues {
  level: 1 | 2 | 3;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export default function TierManager() {
  const [items, setItems] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tier | null>(null);
  const [form] = Form.useForm<TierFormValues>();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await tiersApi.getAll());
    } catch {
      message.error('Չհաջողվեց բեռնել հարկերը');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openCreateModal = () => {
    setEditingItem(null);
    form.setFieldsValue({ level: 1, name: '', sortOrder: 0, isActive: true });
    setModalOpen(true);
  };

  const openEditModal = (item: Tier) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalOpen(true);
  };

  const handleSubmit = async (values: TierFormValues) => {
    try {
      if (editingItem) {
        await tiersApi.update(editingItem._id, values);
        message.success('Հարկը թարմացվեց');
      } else {
        await tiersApi.create(values);
        message.success('Հարկը ավելացվեց');
      }
      setModalOpen(false);
      loadItems();
    } catch {
      message.error('Պահպանումը ձախողվեց');
    }
  };

  const columns: ColumnsType<Tier> = [
    { title: 'Հարկ', dataIndex: 'level', key: 'level', width: 80 },
    { title: 'Անվանում', dataIndex: 'name', key: 'name' },
    { title: 'Դասավորություն', dataIndex: 'sortOrder', key: 'sortOrder', width: 120 },
    {
      title: 'Կարգավիճակ',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'Ակտիվ' : 'Անակտիվ'}
        </Tag>
      ),
    },
    {
      title: 'Գործողություններ',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Խմբագրել
          </Button>
          <Popconfirm
            title="Ջնջե՞լ հարկը"
            okText="Այո"
            cancelText="Ոչ"
            onConfirm={async () => {
              await tiersApi.remove(record._id);
              message.success('Ջնջվեց');
              loadItems();
            }}
          >
            <Button type="link" danger>
              Ջնջել
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Հարկեր
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          Ավելացնել
        </Button>
      </Space>

      <Table rowKey="_id" loading={loading} columns={columns} dataSource={items} />

      <Modal
        title={editingItem ? 'Խմբագրել հարկը' : 'Ավելացնել հարկ'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Պահպանել"
        cancelText="Չեղարկել"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Հարկերի քանակ" name="level" rules={[requiredRule]}>
            <Select
              options={[
                { value: 1, label: '1 հարկանի' },
                { value: 2, label: '2 հարկանի' },
                { value: 3, label: '3 հարկանի' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Անվանում" name="name" rules={[requiredRule]}>
            <Input />
          </Form.Item>
          <Form.Item label="Դասավորություն" name="sortOrder" rules={[requiredRule]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Ակտիվ" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
