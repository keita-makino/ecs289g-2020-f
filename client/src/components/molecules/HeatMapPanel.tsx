import { Grid, View } from '@adobe/react-spectrum';
import { gql, useQuery } from '@apollo/client';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import React, { useEffect, useState } from 'react';
import { Element } from '../../@types';
import { isLoadingVar } from '../../localState';
import { TwoColumnCard } from '../utils/TwoColumnCard';
import { LoadedScreen } from './LoadedScreen';

type PropsBase = { primaryElements: Element[]; secondaryElements: Element[] };
export const defaultValue = { primaryElements: [], secondaryElements: [] };
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as heatMapPanelDefaultValue };
export type HeatMapPanelProps = Props;

const GET_CROSS_TAB_INFO = gql`
  query($primaryElementIds: [String!]!, $secondaryElementIds: [String!]!) {
    crossTabRecordInfo(
      primaryElementIds: $primaryElementIds
      secondaryElementIds: $secondaryElementIds
    ) {
      primaryId
      secondaryId
      records {
        id
      }
    }
  }
`;

type CrossTabRecordInfo = {
  primaryId: string;
  secondaryId: string;
  records: {
    id: string;
  }[];
}[];

const getLabel = (elements: Element[], id: string) =>
  elements.find((item) => item.id === id)?.label || 'no label';
const getValue = (elements: Element[], id: string) =>
  elements.find((item) => item.id === id)?.value || 0;

const useCrossTabData = (props: PropsBase, data: CrossTabRecordInfo) => {
  const [crossTabData, setCrossTabData] = useState<any>();

  useEffect(() => {
    if (data) {
      const primaryIds = data
        .map((item) => item.primaryId)
        .filter((item, index, array) => array.indexOf(item) === index);
      setCrossTabData(
        primaryIds.map((id) => {
          const array = data.filter((item) => item.primaryId === id);
          return array.reduce(
            (prev, curr) => ({
              ...prev,
              [getLabel(props.secondaryElements, curr.secondaryId)]: curr
                .records.length,
            }),
            { primary: getLabel(props.primaryElements, id) }
          );
        })
      );
    }
  }, [data]);

  return crossTabData;
};

export const HeatMapPanel: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = (defaultValue && _props) as Props;
  const { data, loading } = useQuery(GET_CROSS_TAB_INFO, {
    variables: {
      primaryElementIds: props.primaryElements.map((item) => item.id),
      secondaryElementIds: props.secondaryElements.map((item) => item.id),
    },
  });
  const isLoading = isLoadingVar()['plot'];

  useEffect(() => {
    isLoadingVar({ ...isLoadingVar(), plot: loading });
  }, [loading]);

  const plotData = useCrossTabData(props, data?.crossTabRecordInfo);

  const leftOffset = props.primaryElements
    .map((item) => item.label.length)
    .reduce((curr, prev) => (curr > prev ? curr : prev), 0);

  return (
    <LoadedScreen loading={isLoading || plotData === undefined}>
      <TwoColumnCard title={'Plot'}>
        <View width={'100%'} height={'70vh'}>
          {plotData ? (
            <ResponsiveHeatMap
              data={plotData}
              indexBy={'primary'}
              keys={props.secondaryElements.map((item) => item.label)}
              margin={{
                top: 60,
                right: 60,
                bottom: 60,
                left: 60 + leftOffset * 5,
              }}
              axisLeft={{
                legend: 'primary',
                legendPosition: 'middle',
                legendOffset: -40 - leftOffset * 5,
              }}
              axisTop={null}
              axisBottom={{
                legend: 'secondary',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
            />
          ) : null}
        </View>
      </TwoColumnCard>
    </LoadedScreen>
  );
};
HeatMapPanel.defaultProps = defaultValue;
