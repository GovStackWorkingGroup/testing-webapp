import { Request, Response } from 'express';
import complianceRepository from '../../repositories/complianceRepository';

export default class GetAllComplianceReportsRequestHandler {
  constructor(private req: Request, private res: Response) { }

  async getAllComplianceReports(repository: any): Promise<void> {
    try {
      const aggregatedReports = await repository.aggregateComplianceReports();
      this.res.json(aggregatedReports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      this.res.status(500).send("Error fetching compliance reports.");
    }
  }
}