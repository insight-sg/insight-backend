export const getBlobName = (originalName: string) => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  const extension = originalName.split('.').pop();
  const newName =
    originalName.length > 20 ? originalName.substring(0, 20) : originalName;
  return `${identifier}-${newName}.${extension}`;
};
