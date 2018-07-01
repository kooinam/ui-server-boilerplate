export const tagColor = (state) => {
  if (state === 'type') {
    return '#2db7f5';
  } else if (state === 'warning' || state === 'unverified' || state === 'inactive') {
    return '#f0ad4e';
  } else if (state === 'success' || state === 'verified') {
    return '#5cb85c';
  } else if (state === 'ready' || state === 'active') {
    return '#87d068';
  } else if (state === 'danger') {
    return '#d9534f';
  } else if (state === 'Lazada') {
    return '#12384A';
  } else if (state === 'Shopee') {
    return '#ED6136';
  }
}
