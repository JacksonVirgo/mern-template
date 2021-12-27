import { Route } from '../../interfaces';
import { user as UserAuth } from '../../auth';

export const route: Route = {
    auth: UserAuth,
    get: async (req, res) => {
        const { id } = req.params;
        res.status(200).send(id);
    },
};
