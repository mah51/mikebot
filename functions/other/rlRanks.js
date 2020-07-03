module.exports = (mode) => {
  let modeVal;
  switch (mode.toLowerCase()) {
    case 'un-ranked':
      modeVal = 0;
      break;
    case 'ranked duel 1v1':
    case 'duel 1v1':
    case 'duel':
    case '1v1':
      modeVal = 10;
      break;
    case 'ranked doubles 2v2':
    case 'doubles 2v2':
    case 'doubles':
    case '2v2':
      modeVal = 11;
      break;
    case 'ranked solo standard 3v3':
    case 'solo 3v3':
    case 'solo standard':
    case 'ranked solo standard':
      modeVal = 12;
      break;
    case 'ranked standard 3v3':
    case 'standard 3v3':
    case 'standard':
    case '3v3':
      modeVal = 13;
      break;
    case 'hoops':
      modeVal = 27;
      break;
    case 'rumble':
      modeVal = 28;
      break;
    case 'dropshot':
      modeVal = 29;
      break;
    case 'snowday':
      modeVal = 30;
      break;
    default:
      modeVal = null;
      break;
  }
  return modeVal;
};
