import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
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
import type { Cake, Category } from '../types/api';
import { cakesApi, categoriesApi } from '../api/resources';
import { requiredRule } from '../utils/labels';

interface CakeFormValues {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
}

export default function CakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [form] = Form.useForm<CakeFormValues>();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cakesData, categoriesData] = await Promise.all([
        cakesApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setCakes(cakesData);
      setCategories(categoriesData);
    } catch {
      message.error('Չհաջողվեց բեռնել տորթերը');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getCategoryName = (cake: Cake) => {
    if (typeof cake.category === 'string') {
      return categories.find((item) => item._id === cake.category)?.name ?? '—';
    }
    return cake.category?.name ?? '—';
  };

  const openCreateModal = () => {
    setEditingCake(null);
    form.setFieldsValue({
      name: '',
      description: '',
      price: 0,
      category: categories[0]?._id,
      imageUrl: '',
      isFeatured: false,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cake: Cake) => {
    setEditingCake(cake);
    form.setFieldsValue({
      name: cake.name,
      description: cake.description,
      price: cake.price,
      category: typeof cake.category === 'string' ? cake.category : cake.category._id,
      imageUrl: cake.imageUrl,
      isFeatured: cake.isFeatured,
      isActive: cake.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values: CakeFormValues) => {
    try {
      if (editingCake) {
        await cakesApi.update(editingCake._id, values);
        message.success('Տորթը թարմացվեց');
      } else {
        await cakesApi.create(values);
        message.success('Տորթը ավելացվեց');
      }
      setModalOpen(false);
      loadData();
    } catch {
      message.error('Պահպանումը ձախողվեց');
    }
  };

  const columns: ColumnsType<Cake> = [
    { title: 'Անվանում', dataIndex: 'name', key: 'name' },
    {
      title: 'Կատեգորիա',
      key: 'category',
      render: (_, record) => getCategoryName(record),
    },
    {
      title: 'Գին (դր)',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `${price.toLocaleString('hy-AM')} դր`,
    },
    {
      title: 'Առանձնացված',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      width: 120,
      render: (value: boolean) => (value ? 'Այո' : 'Ոչ'),
    },
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
            title="Ջնջե՞լ տորթը"
            okText="Այո"
            cancelText="Ոչ"
            onConfirm={async () => {
              await cakesApi.remove(record._id);
              message.success('Ջնջվեց');
              loadData();
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
    <Card>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Տորթեր
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          Ավելացնել տորթ
        </Button>
      </Space>

      <Table rowKey="_id" loading={loading} columns={columns} dataSource={cakes} />

      <Modal
        title={editingCake ? 'Խմբագրել տորթը' : 'Ավելացնել տորթ'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Պահպանել"
        cancelText="Չեղարկել"
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Անվանում" name="name" rules={[requiredRule]}>
            <Input placeholder="Տորթի անվանում" />
          </Form.Item>
          <Form.Item label="Նկարագրություն" name="description" rules={[requiredRule]}>
            <Input.TextArea rows={3} placeholder="Նկարագրություն" />
          </Form.Item>
          <Form.Item label="Գին (դր)" name="price" rules={[requiredRule]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Կատեգորիա" name="category" rules={[requiredRule]}>
            <Select
              options={categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Նկարի URL" name="imageUrl">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Առանձնացված" name="isFeatured" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Ակտիվ" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
