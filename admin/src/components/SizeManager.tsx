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
import type { Size } from '../types/api';
import { sizesApi } from '../api/resources';
import { requiredRule } from '../utils/labels';

interface SizeFormValues {
  code: 'S' | 'M' | 'L';
  name: string;
  guestRange: string;
  sortOrder: number;
  isActive: boolean;
}

export default function SizeManager() {
  const [items, setItems] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Size | null>(null);
  const [form] = Form.useForm<SizeFormValues>();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await sizesApi.getAll());
    } catch {
      message.error('Չհաջողվեց բեռնել չափսերը');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openCreateModal = () => {
    setEditingItem(null);
    form.setFieldsValue({
      code: 'S',
      name: 'S',
      guestRange: '',
      sortOrder: 0,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: Size) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalOpen(true);
  };

  const handleSubmit = async (values: SizeFormValues) => {
    try {
      if (editingItem) {
        await sizesApi.update(editingItem._id, values);
        message.success('Չափսը թարմացվեց');
      } else {
        await sizesApi.create(values);
        message.success('Չափսը ավելացվեց');
      }
      setModalOpen(false);
      loadItems();
    } catch {
      message.error('Պահպանումը ձախողվեց');
    }
  };

  const columns: ColumnsType<Size> = [
    { title: 'Կոդ', dataIndex: 'code', key: 'code', width: 80 },
    { title: 'Անվանում', dataIndex: 'name', key: 'name' },
    { title: 'Հոգանոց', dataIndex: 'guestRange', key: 'guestRange' },
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
            title="Ջնջե՞լ չափսը"
            okText="Այո"
            cancelText="Ոչ"
            onConfirm={async () => {
              await sizesApi.remove(record._id);
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
          Չափսեր
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          Ավելացնել
        </Button>
      </Space>

      <Table rowKey="_id" loading={loading} columns={columns} dataSource={items} />

      <Modal
        title={editingItem ? 'Խմբագրել չափսը' : 'Ավելացնել չափս'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Պահպանել"
        cancelText="Չեղարկել"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Կոդ" name="code" rules={[requiredRule]}>
            <Select
              options={[
                { value: 'S', label: 'S' },
                { value: 'M', label: 'M' },
                { value: 'L', label: 'L' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Անվանում" name="name" rules={[requiredRule]}>
            <Input />
          </Form.Item>
          <Form.Item label="Հոգանոց" name="guestRange" rules={[requiredRule]}>
            <Input placeholder="օր. 10-12 հոգանոց" />
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
