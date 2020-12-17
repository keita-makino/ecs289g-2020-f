# Migration `20201216215620-initial`

This migration has been generated at 12/16/2020, 1:56:20 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Element" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT,
    "issueId" TEXT,
    "choiceId" TEXT,

    PRIMARY KEY ("id")
)

CREATE TABLE "Choice" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "isTextAllowed" BOOLEAN NOT NULL DEFAULT false,
    "details" TEXT,
    "embedding" DECIMAL(65,30)[],
    "toElementFromChoiceId" TEXT,
    "toElementFromAnswerId" TEXT,

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

CREATE UNIQUE INDEX "Choice_toElementFromChoiceId_unique" ON "Choice"("toElementFromChoiceId")

CREATE UNIQUE INDEX "Choice_toElementFromAnswerId_unique" ON "Choice"("toElementFromAnswerId")

CREATE UNIQUE INDEX "_ElementToRecord_AB_unique" ON "_ElementToRecord"("A", "B")

CREATE INDEX "_ElementToRecord_B_index" ON "_ElementToRecord"("B")

ALTER TABLE "Element" ADD FOREIGN KEY("questionId")REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Element" ADD FOREIGN KEY("issueId")REFERENCES "Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Choice" ADD FOREIGN KEY("toElementFromChoiceId")REFERENCES "Element"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Choice" ADD FOREIGN KEY("toElementFromAnswerId")REFERENCES "Element"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Section" ADD FOREIGN KEY("surveyId")REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Question" ADD FOREIGN KEY("sectionId")REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "Question" ADD FOREIGN KEY("questionId")REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "_ElementToRecord" ADD FOREIGN KEY("A")REFERENCES "Element"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "_ElementToRecord" ADD FOREIGN KEY("B")REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Record" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "Record" ADD FOREIGN KEY("surveyId")REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201216215620-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,94 @@
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
+  id         String    @id @default(uuid())
+  records    Record[]  @relation(references: [id])
+  question   Question? @relation(fields: [questionId], references: [id])
+  issue      Issue?    @relation(fields: [issueId], references: [id])
+  choice     Choice?   @relation("choice")
+  answer     Choice?   @relation("answer")
+  time       DateTime  @default(now())
+  questionId String?
+  issueId    String?
+  choiceId   String?
+}
+
+model Choice {
+  id                    String   @id @default(uuid())
+  value                 Int
+  label                 String
+  isTextAllowed         Boolean  @default(false)
+  details               String?
+  embedding             Float[]
+  toElementFromChoice   Element? @relation("choice", fields: [toElementFromChoiceId], references: [id])
+  toElementFromAnswer   Element? @relation("answer", fields: [toElementFromAnswerId], references: [id])
+  toElementFromChoiceId String?
+  toElementFromAnswerId String?
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


