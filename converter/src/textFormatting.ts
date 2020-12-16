const removeHtmlTags = (text: string) => {
  return text.replace(/<[^>]*>/g, '');
};

const convertNbsps = (text: string) => {
  return text.replace(/&nbsp;/g, ' ');
};

export const textFormatting = (text: string) => {
  return convertNbsps(removeHtmlTags(text));
};
