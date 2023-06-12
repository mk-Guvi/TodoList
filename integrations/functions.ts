export const BackendGet = async (url: string, data?: any) => {
  const fetchUrl = process?.env?.NODE_ENV === 'development' ? url + 'https://cors-anywhere.herokuapp.com/' : url;
  return await fetch(fetchUrl, {
    method: 'GET',
    body: data,
  })
    .then((e) => e.json())
    .then((e) => e)
    .catch((e) => e);
};

export const BackendPost = async (url: string, data?: any) => {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((e) => e.json())
    .catch((e) => e);
};
