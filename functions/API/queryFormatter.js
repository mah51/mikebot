
module.exports = (query) => {
  let queryString = '';
  const queryA = query.split(/\s+/);
  for (let i = 0; i < queryA.length; i += 1) {
    queryString += `${queryA[i]}%20`;
  }
  return queryString;
};
