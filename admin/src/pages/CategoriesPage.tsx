import { Card } from 'antd';
import NamedEntityManager from '../components/NamedEntityManager';
import { categoriesApi } from '../api/resources';

export default function CategoriesPage() {
  return (
    <Card>
      <NamedEntityManager title="Կատեգորիաներ" api={categoriesApi} />
    </Card>
  );
}
