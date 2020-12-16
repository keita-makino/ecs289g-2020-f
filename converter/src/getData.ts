import * as csv from 'csvtojson';
import * as path from 'path';
import { promises as fs } from 'fs';

export const getResponses = async (): Promise<any[]> => {
  return csv({ flatKeys: true }).fromFile(
    path.join(__dirname, './data/responses.csv')
  );
};

export const getSurvey = async (): Promise<any> => {
  const buffer = await fs.readFile(path.join(__dirname, './data/survey.qsf'));
  return JSON.parse(buffer.toString());
};
