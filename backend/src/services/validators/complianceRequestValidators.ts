import Ajv from 'ajv';
type Request = import('express').Request;
type ErrorObject = import('ajv').ErrorObject;
import { ComplianceListFilters, ComplianceListValidationResult} from 'myTypes'

export class ComplianceRequestValidator {

    baseFilter = {"software": [], "bb": []};

    ajv = new Ajv();

    softwareFilterSchema = {
      type: "object",
      properties: {
        software: {
          type: "array",
          items: {
            type: "object",
            properties: {
              version: {
                type: "array",
                items: { type: "string" }
              },
              name: { type: "string" }
            },
            required: ["name"],
            additionalProperties: false
          }
        },
        bb: {
          type: "array",
          items: {
            type: "object",
            properties: {
              version: {
                type: "array",
                items: { type: "string" }
              },
              name: { type: "string" }
            },
            required: ["name"],
            additionalProperties: false
          }
        }
      },
    };
  
    validateListFilters = (filters: ComplianceListFilters|undefined): ComplianceListValidationResult  => {
      if (!filters) {
        return {'errors': undefined, filters: this.baseFilter};
      }
  
      try {
        const validate = this.ajv.compile(this.softwareFilterSchema);
        const valid = validate(filters);
  
        if (!valid) {
          return {'errors': validate.errors, filters: {"software": [], "bb": []}} ;
        }
  
        return {'errors': undefined, filters: {...this.baseFilter, ...filters} as ComplianceListFilters}
      } catch (error) {
        return {'errors': `List compliance filter validation failed unexpectedly, reason ${error}`, filters: this.baseFilter};
      }
    }

}
