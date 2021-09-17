/**
 * 
 * @param {{ method?: string; url: string; baseUrl: string; body?: any }} args 
 */
const fetchInterceptors = async (args) => {
  const { method = 'GET', url, baseUrl, body } = args;
  const config = { method, headers: { "Content-Type": "application/json" }, credentials: 'include' };
  if (method !== 'GET' && body) Object.assign(config, { body: JSON.stringify(body) });

  const response = await fetch(`${baseUrl}${url}`, config);
  const status = response.status;
  const rspBody = await response.json();

  // token expired when status === 401 or success false, with response data = -1
  if (status === 401 && rspBody?.data === -1) {
    await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });
    const newResp = await fetch(`${baseUrl}${url}`, config);
    const newRspBody = await newResp.json();
    return newRspBody;
  }
  return rspBody;
}

export default fetchInterceptors;