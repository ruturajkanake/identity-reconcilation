import { Response } from 'express';

export const SUCCESS = (
    res: Response,
    data: unknown,
    message: string
): Response => {
    return res.status(200).json({ status: 'success', data, message });
};

export const CREATE = (
    res: Response,
    data: unknown,
    message: string
): Response => {
    return res.status(201).json({ status: 'success', data, message });
};

export const BAD_REQUEST = (res: Response, data: unknown): Response => {
    return res
        .status(400)
        .json({ status: 'fail', data, message: 'Bad Request' });
};

export const UNAUTHORIZED = (res: Response, data: unknown): Response => {
    return res
        .status(401)
        .json({ status: 'fail', data, message: 'Unauthorized' });
};

export const FORBIDDEN = (res: Response, data: unknown): Response => {
    return res.status(403).json({ status: 'fail', data, message: 'Forbidden' });
};

export const NOT_FOUND = (res: Response, data: unknown): Response => {
    return res.status(404).json({ status: 'fail', data, message: 'Not Found' });
};

export const INTERNAL_ERROR = (res: Response, data: unknown): Response => {
    return res
        .status(500)
        .json({ status: 'fail', data, message: 'Internal Server Error' });
};
