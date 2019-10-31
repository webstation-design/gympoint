import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {

  async index(req, res) {

    const students = await Student.findAll({
      order: ['name']
    });

    return res.json(students);

  }

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
      age: Yup.number().required().min(1),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    validation = Yup.object().shape({
      weight: Yup.number().required().min(1),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid weight' });
    }

    validation = Yup.object().shape({
      height: Yup.number().required().min(100).max(250),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid height' });
    }

    const duplicity = await Student.findOne({ where: { email: req.body.email } });

    if (duplicity) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);

  }

  async update(req, res) {

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: "Student cannot be found" });
    }

    var validation = Yup.object().shape({
      name: Yup.string(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    validation = Yup.object().shape({
      email: Yup.string().email(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid e-mail' });
    }

    validation = Yup.object().shape({
      age: Yup.number().min(1),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    validation = Yup.object().shape({
      weight: Yup.number().min(1),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid weight' });
    }

    validation = Yup.object().shape({
      height: Yup.number().min(100).max(250),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid height' });
    }

    const { email } = req.body;

    if (email && email !== student.email) {

      const duplicity = await Student.findOne({ where: { email: email } });

      if (duplicity) return res.status(400).json({ error: 'E-mail in use by another student' });

    }

    return res.json(await student.update(req.body));

  }

  async delete(req, res) {

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: "Student cannot be found" });
    }

    try {

      await Student.destroy({
        where: {
          id: student.id
        }
      });

      return res.json({ success: true });

    }
    catch (err) {
      return res.json({ success: false, error: err.message });
    }

  }

}

export default new StudentController();