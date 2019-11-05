import Sequelize from 'sequelize';
import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {

  async index(req, res) {

    const { Op } = Sequelize;

    var { search, pageIndex, pageSize } = req.query;

    if (!pageIndex || pageIndex < 1) pageIndex = 1;

    if (!pageSize || pageSize <= 0) pageSize = process.env.PAGE_SIZE;

    var where = [];

    if (search) where.push(Sequelize.or(
      {
        title: {
          [Op.like]: `%${search}%`
        }
      },
      {
        duration: search
      },
      {
        price: search
      }
    ));

    const plans = await Plan.findAll({
      where: Sequelize.and(where),
      order: ['duration', 'title'],
      limit: parseInt(pageSize),
      offset: (parseInt(pageIndex) - 1) * parseInt(pageSize),
    });

    return res.json(plans);

  }

  async store(req, res) {

    var validation = Yup.object().shape({
      title: Yup.string().required(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Title is required' });
    }

    validation = Yup.object().shape({
      duration: Yup.number().required().min(1).max(12),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid duration in months' });
    }

    validation = Yup.object().shape({
      price: Yup.number().required().min(0.01).max(999999.99),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const duplicity = await Plan.findOne({
      where: {
        title: req.body.title,
        duration: req.body.duration
      }
    });

    if (duplicity) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);

  }

  async update(req, res) {

    const { Op } = Sequelize;

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: "Plan cannot be found" });
    }

    var validation = Yup.object().shape({
      title: Yup.string(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid title' });
    }

    validation = Yup.object().shape({
      duration: Yup.number().min(1).max(12),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid duration in months' });
    }

    validation = Yup.object().shape({
      price: Yup.number().min(0.01).max(999999.99),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    var { title, duration } = req.body;

    if (!title) title = plan.title;
    if (!duration) duration = plan.duration;

    const duplicity = await Plan.findOne({
      where: {
        title: title,
        duration: duration,
        id: { [Op.not]: plan.id }
      }
    });

    if (duplicity) return res.status(400).json({ error: 'Title and duration in use by another plan' });

    return res.json(await plan.update(req.body));

  }

  async delete(req, res) {

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: "Plan cannot be found" });
    }

    try {

      await Plan.destroy({
        where: {
          id: plan.id
        }
      });

      return res.json({ success: true });

    }
    catch (err) {
      return res.json({ success: false, error: err.message });
    }

  }

}

export default new PlanController();