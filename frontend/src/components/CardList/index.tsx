import * as React from 'react';
import { Card } from './Card';

export interface CardListProps {
}

const testData = [
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
  'https://pds.joins.com/news/component/htmlphoto_mmdata/202001/17/e8c85a1a-0f3e-49a6-8518-e7a705dfff1d.jpg',
];

const CardMap : any = testData.map((item, i)=> <Card key={i} imageUrl={item} />);

export default function CardList (props: CardListProps) {
  return CardMap;
}
