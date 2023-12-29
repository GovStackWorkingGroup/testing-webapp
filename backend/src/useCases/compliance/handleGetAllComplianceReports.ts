import { Request, Response } from 'express';
import complianceRepository from '../../repositories/complianceRepository';
import { ComplianceDbRepository, ComplianceListFilter } from "myTypes";
import { ComplianceRequestValidator } from '../../services/validators/complianceRequestValidators' 

interface User {
  id: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export default class GetAllComplianceReportsRequestHandler {

  private repository: ComplianceDbRepository;
  private isAuthenticated: Boolean;

  private valiator: ComplianceRequestValidator = new ComplianceRequestValidator();

  constructor(private req: AuthenticatedRequest, private res: Response, repository: ComplianceDbRepository, isAuthenticated: Boolean) {
    this.repository = repository;
    this.req = req;
    this.isAuthenticated = isAuthenticated;
  }

  async getAllComplianceReports(): Promise<void> {
    const limit = parseInt(this.req.query.limit as string, 10) || Number.MAX_SAFE_INTEGER;
    const offset = parseInt(this.req.query.offset as string, 10) || 0;
    const filters = this.req.query.filters? JSON.parse(this.req.query.filters as string): undefined;
    try {
      const validationErrors = this.valiator.validateListFilters(filters);
      if (validationErrors.errors) {
        this.res.status(400).json(validationErrors.errors);

      } else {
        const aggregatedReports = await this.repository.aggregateComplianceReports(limit, offset, validationErrors.filters, this.isAuthenticated);
        console.log(aggregatedReports);
        this.res.json(aggregatedReports);
      }


    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      this.res.status(500).send("Error fetching compliance reports.");
    }
  }
}

