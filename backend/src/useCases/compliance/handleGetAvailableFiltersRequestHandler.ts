import { Request, Response } from 'express';
import complianceRepository from '../../repositories/complianceRepository';
import { ComplianceDbRepository, ComplianceListFilter } from "myTypes";
import { ComplianceRequestValidator } from '../../services/validators/complianceRequestValidators' 

interface User {
  id: string;
  username: string;
}


export default class GetAvailableFiltersRequestHandler {

  private repository: ComplianceDbRepository;

  private valiator: ComplianceRequestValidator = new ComplianceRequestValidator();

  constructor(private req: Request, private res: Response, repository: ComplianceDbRepository) {
    this.repository = repository;
    this.req = req;
    this.res = res;
  }

  async getAvailableFilters(): Promise<void> {
    const filterType = this.req.params.type;
    if (!filterType) {
      this.res.status(400).send("Filter type not provided.");
    }
    try {
      switch(filterType) { 
        case 'software': { 
          const result = await this.repository.getAllSoftwares()
          this.res.json(result);
          break; 
        } 
        case 'bb': { 
          const result = await this.repository.getAllBBs()
          this.res.json(result);
          break; 
        } 
        default: { 
          this.res.status(400).send(`Invalid filter type '${filterType}', allowed: 'software', 'bb'.`);
          break; 
        } 
      } 

    } catch (error) {
      console.error("Error fetching compliance reports:\n", error);
      this.res.status(500).send("Error fetching compliance reports.");
    }
  }
}

