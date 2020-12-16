import { Record } from './compileRecords';

export const linkRecordsToSurvey = async (
  records: Record[],
  surveyId: number
) => {
  return records.map((item) => ({
    ...item,
    Survey: { connect: { id: surveyId } },
  }));
};
