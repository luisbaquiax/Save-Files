export const getNameFile = (name: string) =>{
  const names = name.split('.');
  return names.slice(0, -1).join('.');
}

export const getDefaultContentFile = () =>{
  return ' ';
}
