import * as ld from 'lodash';

export const recodeValue = (obj: string, indices: any[] | undefined) => {
  return indices
    ? Number(
        Object.entries(indices).find((index) => ld.isEqual(index[0], obj))[1]
      )
    : Number(obj);
};
