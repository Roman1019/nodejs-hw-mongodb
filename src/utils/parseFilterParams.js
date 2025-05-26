function parseIsFavourite(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
}
export function parseFilterParams(query) {
  const { isFavourite, type } = query;
  return {
    isFavourite: parseIsFavourite(isFavourite),
    type,
  };
}
