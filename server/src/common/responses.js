/**
 * 
 * @param {import('express').Response} res 
 * @param {*} data 
 */
export const successResponse = (res, data) => {
  res.json({ success: true, data });
}

/**
 * 
 * @param {import('express').Response} res 
 * @param {*} param1 
 */
export const failureResponse = (res, { ...payload }) => {
  res.json({ success: false, ...payload });
}

/**
 * 
 * @param {import('express').Response} res 
 * @param {number} status 
 * @param {*} payloadData
 */
export const serverErrorResponse = (res, status, { ...payload }) => {
  res.status(status).json({ success: false, ...payload });
}