export const log = (obj: any) => {
  if (typeof obj === 'object') {
    console.log(JSON.stringify(obj, null, '  '));
    return;
  }
  console.log(obj);
};
