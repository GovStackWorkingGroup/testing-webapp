import { Request, Response } from 'express';
import complianceRepository from '../../repositories/complianceRepository';
import { stat } from 'fs';

export default class GetAllComplianceReportsRequestHandler {
  constructor(private req: Request, private res: Response) { }

  async getAllComplianceReports(repository: any): Promise<void> {
    try {
      const reports = await repository.findAll();
      console.log(typeof (reports));
      const transformedData = this.transformData(reports);

      this.res.json(transformedData);
    } catch (error) {
      this.res.status(500).send("Error compliance report.");
    }
  }

  private transformData(dataFromDB: any): any {
    let transformedData: any = {};

    dataFromDB.forEach((record: any) => {
      const {
        softwareName,
        compliance
      } = record;

      compliance.forEach((complianceItem: any) => {
        const { version, bbDetails } = complianceItem;

        bbDetails.forEach((bbDetailsItem: any, bb: string) => {
          const {
            bbSpecification,
            bbVersion,
            status,
            submissionDate,
            deploymentCompliance,
            requirementSpecificationCompliance,
            interfaceCompliance,
          } = bbDetailsItem;

          if (!transformedData[softwareName]) {
            transformedData[softwareName] = [];
          }

          transformedData[softwareName].push({
            bb: bb,
            softwareVersion: version,
            bbVersion: bbVersion,
            status: status,
            submissionDate: submissionDate,
            deploymentCompliance: deploymentCompliance.isCompliant,
            requirementSpecificationCompliance: requirementSpecificationCompliance.level,
            interfaceCompliance: interfaceCompliance.level
          });


        });

      });
    });
    return transformedData;
  };
}