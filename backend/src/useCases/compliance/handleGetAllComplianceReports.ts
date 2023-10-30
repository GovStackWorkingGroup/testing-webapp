import { Request, Response } from 'express';
import complianceRepository from '../../repositories/complianceRepository';
import { ComplianceDbRepository } from "myTypes";

export default class GetAllComplianceReportsRequestHandler {

  private repository: ComplianceDbRepository;

  constructor(private req: Request, private res: Response, repository: ComplianceDbRepository) {
    this.repository = repository;
  }

  async getAllComplianceReports(): Promise<void> {
    const { limit, offset } = this.req.query;
    try {
      const aggregatedReports = await this.repository.aggregateComplianceReports(limit, offset);
      this.res.json(aggregatedReports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      this.res.status(500).send("Error fetching compliance reports.");
    }
  }
}

