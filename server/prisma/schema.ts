import { nexusPrisma } from "nexus-plugin-prisma";
import {
  extendType,
  interfaceType,
  list,
  makeSchema,
  mutationField,
  mutationType,
  nonNull,
  objectType,
  queryField,
  queryType,
  stringArg,
  unionType,
} from "@nexus/schema";

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.records();
  },
});

const Record = objectType({
  name: "Record",
  definition(t) {
    t.model.id();
    t.model.meta();
    t.model.elements();
    t.model.user();
  },
});

const CrossTabRecordInfo = objectType({
  name: "CrossTabRecordInfo",
  definition(t) {
    t.list.field("records", {
      type: "Record",
    });
    t.string("primaryId");
    t.string("secondaryId");
  },
});

const getCrossTabRecordInfo = extendType({
  type: "Query",
  definition(t) {
    t.list.field("crossTabRecordInfo", {
      type: CrossTabRecordInfo,
      args: {
        primaryElementIds: nonNull(list(nonNull(stringArg()))),
        secondaryElementIds: nonNull(list(nonNull(stringArg()))),
      },
      async resolve(_root, { primaryElementIds, secondaryElementIds }, ctx) {
        const results = primaryElementIds.map((primaryId: string) => {
          return secondaryElementIds.map((secondaryId: string) => {
            return ctx.prisma.element.findUnique({
              include: {
                records: {
                  where: {
                    elements: {
                      some: {
                        id: secondaryId,
                      },
                    },
                  },
                },
              },
              where: {
                id: primaryId,
              },
            });
          });
        });
        const res = (
          await Promise.all(
            (await Promise.all(results)).map(async (item, index) => {
              const array = await Promise.all(item);
              return array.map((item2, index2) => ({
                records: item2!.records,
                primaryId: primaryElementIds[index],
                secondaryId: secondaryElementIds[index2],
              }));
            })
          )
        ).flat();
        return res;
      },
    });
  },
});

const Element = objectType({
  name: "Element",
  definition(t) {
    t.model.id();
    t.model.value();
    t.model.label();
    t.model.details();
    t.model.records();
    t.model.question();
    t.model.isChoice();
    t.model.isAnswer();
    t.model.time();
  },
});

const Survey = objectType({
  name: "Survey",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.sections();
  },
});

const Section = objectType({
  name: "Section",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.questions({ ordering: true });
  },
});

const Question = objectType({
  name: "Question",
  definition(t) {
    t.model.id();
    t.model.qid();
    t.model.name();
    t.model.tag();
    t.model.text();
    t.model.type();
    t.model.selector();
    t.model.section();
    t.model.elements();
    t.model.embedding();
  },
});

const Query = queryField((t) => {
  t.crud.users();
  t.crud.records();
  t.crud.elements();
  t.crud.surveys();
  t.crud.sections({ ordering: true });
  t.crud.questions({ ordering: true });
  t.crud.record();
  t.crud.question();
  t.crud.element();
});

const Mutation = mutationField((t) => {
  t.crud.createOneUser();
  t.crud.createOneElement();
  t.crud.createOneQuestion();
  t.crud.createOneRecord();
  t.crud.createOneSection();
  t.crud.createOneSurvey();
  t.crud.deleteOneElement();
  t.crud.deleteOneQuestion();
  t.crud.deleteOneRecord();
  t.crud.deleteOneSection();
  t.crud.deleteOneSurvey();
  t.crud.deleteManyUser();
  t.crud.deleteManyElement();
  t.crud.deleteManyQuestion();
  t.crud.deleteManyRecord();
  t.crud.deleteManySection();
  t.crud.deleteManySurvey();
  t.crud.updateOneUser();
  t.crud.updateOneElement();
  t.crud.updateOneQuestion();
  t.crud.updateOneRecord();
  t.crud.updateOneSection();
  t.crud.updateOneSurvey();
  t.crud.updateManyUser();
  t.crud.updateManyElement();
  t.crud.updateManyQuestion();
  t.crud.updateManyRecord();
  t.crud.updateManySection();
  t.crud.updateManySurvey();
});

export const schema = makeSchema({
  types: [
    User,
    Record,
    Element,
    Survey,
    Section,
    Question,
    Query,
    Mutation,
    CrossTabRecordInfo,
    getCrossTabRecordInfo,
  ],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus.d.ts",
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});
