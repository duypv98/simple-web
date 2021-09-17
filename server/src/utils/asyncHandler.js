/**
 * 
 * @param {(req: import('express').Request & { credentials?: { user_id: number; role?: string; user_name?: string }}, res: import('express').Response, next?: import('express').NextFunction) => Promise<any>} fn
 * @returns {import('express').RequestHandler}
 */
export default function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}