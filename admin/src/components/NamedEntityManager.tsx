import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { NamedEntity } from '../types/api';
import { requiredRule } from '../utils/labels';

interface NamedEntityApi {
  getAll: () => Promise<NamedEntity[]>;
  create: (body: Partial<NamedEntity>) => Promise<NamedEntity>;
  update: (id: string, body: Partial<NamedEntity>) => Promise<NamedEntity>;
  remove: (id: string) => Promise<void>;
}

interface NamedEntityManagerProps {
  title: string;
  api: NamedEntityApi;
}

interface FormValues {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export default function NamedEntityManager({ title, api }: NamedEntityManagerProps) {
  const [items, setItems] = useState<NamedEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NamedEntity | null>(null);
  const [form] = Form.useForm<FormValues>();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setItems(data);
    } catch {
      message.error('Չհաջողվեց բեռնել տվյալները');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openCreateModal = () => {
    setEditingItem(null);
    form.setFieldsValue({ name: '', sortOrder: 0, isActive: true });
    setModalOpen(true);
  };

  const openEditModal = (item: NamedEntity) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (editingItem) {
        await api.update(editingItem._id, values);
        message.success('Հաջողությամբ թարմացվեց');
      } else {
        await api.create(values);
        message.success('Հաջողությամբ ավելացվեց');
      }
      setModalOpen(false);
      loadItems();
    } catch {
      message.error('Պահպանումը ձախողվեց');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.remove(id);
      message.success('Հաջողությամբ ջնջվեց');
      loadItems();
    } catch {
      message.error('Ջնջումը ձախողվեց');
    }
  };

  const columns: ColumnsType<NamedEntity> = [
    { title: 'Անվանում', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
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
            title="Ջնջե՞լ գրառումը"
            okText="Այո"
            cancelText="Ոչ"
            onConfirm={() => handleDelete(record._id)}
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
          {title}
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          Ավելացնել
        </Button>
      </Space>

      <Table rowKey="_id" loading={loading} columns={columns} dataSource={items} />

      <Modal
        title={editingItem ? 'Խմբագրել' : 'Ավելացնել'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Պահպանել"
        cancelText="Չեղարկել"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Անվանում" name="name" rules={[requiredRule]}>
            <Input placeholder="Մուտքագրեք անվանումը" />
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
