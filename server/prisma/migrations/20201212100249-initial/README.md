# Migration `20201212100249-initial`

This migration has been generated at 12/12/2020, 2:02:50 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surveyId" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "Element" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT,
    "details" JSONB,
    "isChoice" BOOLEAN NOT NULL DEFAULT false,
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,
    "isTextAllowed" BOOLEAN NOT NULL DEFAULT false,
    "questionId" TEXT,
    "issueId" TEXT,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "embedding" DECIMAL(65,30)[],

    PRIMARY KEY ("id")
)

CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "qid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "subSelector" TEXT,
    "sectionId" TEXT,
    "questionId" TEXT,
    "embedding" DECIMAL(65,30)[],

    PRIMARY KEY ("id")
)

CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "referenceNumber" INTEGER[],
    "text" TEXT NOT NULL,

    PRIMARY KEY ("id")
)

CREATE TABLE "_ElementToRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
)

CREATE UNIQUE INDEX "_ElementToRecord_AB_unique" ON "_ElementToRecord"("A", "B")

CREATE INDEX "_ElementToRecord_B_index" ON "_ElementToRecord"("B")

ALTER TABLE "Record" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Record" ADD FOREIGN KEY("surveyId")REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Element" ADD FOREIGN KEY("questionId")REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Element" ADD FOREIGN KEY("issueId")REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Section" ADD FOREIGN KEY("surveyId")REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Question" ADD FOREIGN KEY("sectionId")REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Question" ADD FOREIGN KEY("questionId")REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "_ElementToRecord" ADD FOREIGN KEY("A")REFERENCES "Element"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "_ElementToRecord" ADD FOREIGN KEY("B")REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201212100249-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,85 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id      String   @id @default(uuid())
+  records Record[]
+}
+
+model Record {
+  id       String    @id @default(uuid())
+  meta     Json
+  elements Element[] @relation(references: [id])
+  user     User      @relation(fields: [userId], references: [id])
+  userId   String
+  time     DateTime  @default(now())
+  Survey   Survey?   @relation(fields: [surveyId], references: [id])
+  surveyId String?
+}
+
+model Element {
+  id            String    @id @default(uuid())
+  value         Int
+  label         String?
+  details       Json?
+  records       Record[]  @relation(references: [id])
+  question      Question? @relation(fields: [questionId], references: [id])
+  issue         Issue?    @relation(fields: [issueId], references: [id])
+  isChoice      Boolean   @default(false)
+  isAnswer      Boolean   @default(false)
+  isTextAllowed Boolean   @default(false)
+  questionId    String?
+  issueId       String?
+  time          DateTime  @default(now())
+  embedding     Float[]
+}
+
+model Survey {
+  id       String    @id @default(uuid())
+  name     String
+  sections Section[]
+  Record   Record[]
+}
+
+model Section {
+  id        String     @id @default(uuid())
+  name      String
+  questions Question[]
+  survey    Survey     @relation(fields: [surveyId], references: [id])
+  surveyId  String
+}
+
+model Question {
+  id          String     @id @default(uuid())
+  qid         String
+  name        String
+  tag         String
+  text        String
+  type        String
+  selector    String
+  subSelector String?
+  section     Section?   @relation(fields: [sectionId], references: [id])
+  categories  Question[] @relation("questionToCategories")
+  elements    Element[]
+  question    Question?  @relation("questionToCategories", fields: [questionId], references: [id])
+  sectionId   String?
+  questionId  String?
+  embedding   Float[]
+}
+
+model Issue {
+  id              String    @id @default(uuid())
+  name            String
+  referenceNumber Int[]
+  text            String
+  elements        Element[]
+}
```


