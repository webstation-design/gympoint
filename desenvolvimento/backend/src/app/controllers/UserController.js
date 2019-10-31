import * as Yup from "yup";

import User from '../models/User';

class UserController {

    async store(req, res) {

        var validation = Yup.object().shape({
            name: Yup.string().required(),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Name is required' });
        }

        validation = Yup.object().shape({
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

        validation = Yup.object().shape({
            password: Yup.string().min(5).max(15),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Password must be between 5 and 15 characters' });
        }

        const duplicity = await User.findOne({ where: { email: req.body.email } });

        if (duplicity) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const { id, name, email } = await User.create(req.body);

        return res.json({
            id,
            name,
            email,
        });

    }

    async update(req, res) {

        var validation = Yup.object().shape({
            name: Yup.string(),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Invalid name ' });
        }

        validation = Yup.object().shape({
            email: Yup.string().email(),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Invalid e-mail' });
        }

        validation = Yup.object().shape({
            oldPassword: Yup.string().when('password', (password, field) =>
                password ? field.required() : field
            )
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Old password is required when new password is set' });
        }

        validation = Yup.object().shape({
            oldPassword: Yup.string().min(6).max(15),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Old password must be between 5 and 15 characters' });
        }

        validation = Yup.object().shape({
            password: Yup.string().when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            )
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'New password is required when old password is set' });
        }

        validation = Yup.object().shape({
            password: Yup.string().min(6).max(15),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'New password must be between 5 and 15 characters' });
        }

        validation = Yup.object().shape({
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        if (!(await validation.isValid(req.body))) {
            return res.status(400).json({ error: 'Password confirmation does not match' });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email !== user.email) {

            const userExists = await User.findOne({ where: { email: req.body.email } });

            if (userExists) return res.status(400).json({ error: 'E-mail in use by another user' });

        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            name,
            email,
        });

    }

}

export default new UserController();