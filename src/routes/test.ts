import { Route } from '../interfaces';

export const route: Route = {
    get: async (req, res, next) => {
        res.status(200).send('Base');
    },
};
