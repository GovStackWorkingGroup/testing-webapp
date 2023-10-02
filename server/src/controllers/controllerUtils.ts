import { Response } from 'express';

export const default500Error = (responseObject: Response, errorList: string | string[]): Response => 
  responseObject.status(500).send(`Unexpected exception occurred:\n${Array.isArray(errorList) ? errorList.join('\n') : errorList}`);
