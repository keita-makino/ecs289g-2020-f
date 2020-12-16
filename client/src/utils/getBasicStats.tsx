export const getBasicStats = (questionDetails: any) => ({
  ID: questionDetails.id,
  QID: questionDetails.qid,
  Tag: questionDetails.tag,
  Description: questionDetails.text,
  Type: questionDetails.type,
});
