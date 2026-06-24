import { Card, Tabs } from 'antd';
import NamedEntityManager from '../components/NamedEntityManager';
import SizeManager from '../components/SizeManager';
import TierManager from '../components/TierManager';
import { fillingsApi, fruitsApi, nutsApi } from '../api/resources';

export default function ComponentsPage() {
  return (
    <Card>
      <Tabs
        items={[
          {
            key: 'fruits',
            label: 'Մրգեր',
            children: <NamedEntityManager title="Մրգեր" api={fruitsApi} />,
          },
          {
            key: 'nuts',
            label: 'Ընդեղեն',
            children: <NamedEntityManager title="Ընդեղեն" api={nutsApi} />,
          },
          {
            key: 'fillings',
            label: 'Միջուկ / Նաճինկա',
            children: <NamedEntityManager title="Միջուկ / Նաճինկա" api={fillingsApi} />,
          },
          {
            key: 'sizes',
            label: 'Չափսեր',
            children: <SizeManager />,
          },
          {
            key: 'tiers',
            label: 'Հարկեր',
            children: <TierManager />,
          },
        ]}
      />
    </Card>
  );
}
