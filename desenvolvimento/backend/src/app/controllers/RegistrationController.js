import Registration from '../models/Registration';
import Student from '../models/Student';

class RegistrationController {

  async index(req, res) {

    var { pageIndex, pageSize } = req.query;

    if (!pageIndex || pageIndex < 1) pageIndex = 1;

    if (!pageSize || pageSize <= 0) pageSize = process.env.PAGE_SIZE;

    const registrations = await Registration.findAll({
      include: [{model: Student, as: 'student'}],
      order: [['start_date', 'desc'], ['student', 'name', 'asc']],
      limit: parseInt(pageSize),
      offset: (parseInt(pageIndex) - 1) * parseInt(pageSize),
    });

    return res.json(registrations);

  }

}

export default new RegistrationController();