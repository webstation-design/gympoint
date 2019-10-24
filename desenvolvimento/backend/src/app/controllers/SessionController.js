import * as Yup from "yup";
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {

    async store(req, res) {

        var validation = Yup.object().shape({
            email: Yup.string().required(),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'E-mail is required' });
        }

        validation = Yup.object().shape({
            email: Yup.string().email(),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Invalid e-mail' });
        }

        validation = Yup.object().shape({
            password: Yup.string().required(),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!(await user.checkPassword(password)))
            return res.status(401).json({ error: 'Invalid password' });

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        })

    }

}

export default new SessionController();