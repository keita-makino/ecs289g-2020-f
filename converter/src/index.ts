#!/usr/bin/env node

import { Command } from 'commander';
import { getSections } from './getSections';
import { getResponses, getSurvey } from './getData';
import { writeFile } from 'fs';
import * as path from 'path';
import { compileRecords } from './compileRecords';
import { extractElements } from './extractElements';
import { createSurvey } from './createSurvey';
import { exportDefaultElementsAsCsv } from './exportDefaultElementsAsCsv';
import { exportQuestionsAsCsv } from './exportQuestionsAsCsv';
import { linkRecordsToSurvey } from './linkRecordsToSurvey';

export const main = async () => {
  const _survey = await getSurvey();
  const _sections = getSections(_survey);

  const _elements = (await _sections).flatMap((section) =>
    section.questions.create.reduce(
      (prev, curr) => [...prev, ...extractElements(curr)],
      []
    )
  );

  const questionsFlatten = (await _sections).flatMap((section) =>
    section.questions.create.flatMap((question) =>
      question.categories ? question.categories.create : question
    )
  );

  exportDefaultElementsAsCsv(_elements, questionsFlatten);
  exportQuestionsAsCsv(questionsFlatten);

  const responses = getResponses();
  if ((await responses).length === 2) {
    return;
  }

  const [recordsUnlinked, elements] = await compileRecords(
    _sections,
    (await responses).slice(2),
    _elements
  );
  const survey = await createSurvey(_sections);

  const records = linkRecordsToSurvey(recordsUnlinked, survey.id);

  writeFile(
    path.join(__dirname, './data/survey.json'),
    JSON.stringify(survey, null, 1),
    { flag: 'w' },
    () => {
      console.log('survey exported.');
    }
  );
  writeFile(
    path.join(__dirname, './data/records.json'),
    JSON.stringify(await records, null, 1),
    { flag: 'w' },
    () => {
      console.log('records exported.');
    }
  );
  writeFile(
    path.join(__dirname, './data/elements.json'),
    JSON.stringify(elements, null, 1),
    { flag: 'w' },
    () => {
      console.log('elements exported.');
    }
  );
};

const func = async () => {
  const program = new Command();

  console.log('program.args');
  program.version('0.0.1').action(main);

  await program.parseAsync(process.argv);

  console.log(program.args);
};

func();
