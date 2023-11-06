import { Request, Response } from 'express';
import complianceRepository from '../../repositories/complianceRepository';
import { ComplianceDbRepository } from "myTypes";

export default class GetAllComplianceReportsRequestHandler {

  private repository: ComplianceDbRepository;

  constructor(private req: Request, private res: Response, repository: ComplianceDbRepository) {
    this.repository = repository;
  }

  async getAllComplianceReports(): Promise<void> {
    const limit = parseInt(this.req.query.limit as string, 10) || Number.MAX_SAFE_INTEGER;
    const offset = parseInt(this.req.query.offset as string, 10) || 0;
    
    try {
      const aggregatedReports = await this.repository.aggregateComplianceReports(limit, offset);
      this.res.json(aggregatedReports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      this.res.status(500).send("Error fetching compliance reports.");
    }
  }
}

