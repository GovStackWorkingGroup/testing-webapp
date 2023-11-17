import { AllBBRequirements, BBRequirement, ComplianceDbRepository, ComplianceReport } from "myTypes";

const complianceRepository = (repository: ComplianceDbRepository) => {
  const findAll = async () => {
    return repository.findAll();
  };

  const aggregateComplianceReports = async (limit, offset) => {
    try {
      return await repository.aggregateComplianceReports(limit, offset);
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  };

  const getSoftwareComplianceDetail = async (softwareName: string) => {
    try {
      return await repository.getSoftwareComplianceDetail(softwareName);
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  };

  const getFormDetail = async (formId: string) => {
    try {
      return await repository.getFormDetail(formId);
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  }

  const createOrSubmitForm = async (draftData: Partial<ComplianceReport>) => {
    try {
      return await repository.createOrSubmitForm(draftData);
    } catch (error) {
      console.error('There was an error while creating the draft:', error);
      throw error;
    }
  };

  const editDraftForm = async (draftId: string, updateData: Partial<ComplianceReport>) => {
    try {
      return await repository.editDraftForm(draftId, updateData);
    } catch (error) {
      console.error('There was an error while editing the form:', error);
      throw error;
    }
  };


  const getAllBBRequirements = async (): Promise<AllBBRequirements> => {
    try {
      return await repository.getAllBBRequirements();
    } catch (error) {
      console.error('There was an error while fetching all BB requirements:', error);
  throw error;
}
  };

const getBBRequirements = async (bbKey: string): Promise<BBRequirement[]> => {
  try {
    return await repository.getBBRequirements(bbKey);
  } catch (error) {
    console.error('There was an error while fetching BB requirements:', error);
    throw error;
  }
};

  return {
    findAll,
    aggregateComplianceReports,
    getSoftwareComplianceDetail,
    getFormDetail,
    createOrSubmitForm,
    editDraftForm,
    getAllBBRequirements,
    getBBRequirements
  };
};

export default complianceRepository;
