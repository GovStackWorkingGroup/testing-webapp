import Compliance from '../schemas/compliance';

const mongoComplianceRepository = {
  async find() {
    try {
      return await Compliance.find();
    } catch (error) {
      throw new Error('Error fetching compliance records');
    }
  },
};

export default mongoComplianceRepository;
