import { AllBBRequirements, BBRequirement, ComplianceDbRepository, ComplianceReport, StatusEnum, draftDataForRollback } from "myTypes";

const complianceRepository = (repository: ComplianceDbRepository) => {
  const findAll = async () => {
    return repository.findAll();
  };

  const getAllBBs = async () => {
    try {
      return await repository.getAllBBs();
    } catch (error) {
      console.error('There was an error while aggregating building blocks:', error);
      throw error;
    }
  };

  const getAllSoftwares = async () => {
    try {
      return await repository.getAllSoftwares();
    } catch (error) {
      console.error('There was an error while aggregating softwares.');
      throw error;
    }
  };

  const aggregateComplianceReports = async (limit, offset, filters, isAuthenticated) => {
    try {
      return await repository.aggregateComplianceReports(limit, offset, filters, isAuthenticated);
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
  };

  const getDraftDetail = async (draftUuid: string) => {
    try {
      return await repository.getDraftDetail(draftUuid);
    } catch (error) {
      console.error('There was an error while aggregating the compliance reports:', error);
      throw error;
    }
  };

  const createOrSubmitForm = async (draftData: Partial<ComplianceReport>) => {
    try {
      return await repository.createOrSubmitForm(draftData);
    } catch (error) {
      console.error('There was an error while creating the draft:', error);
      throw error;
    }
  };

  const submitForm = async (uniqueId: string) => {
    try {
      return await repository.submitForm(uniqueId);
    } catch (error) {
      console.error('There was an error while submitting the form', error);
      throw error;
    }
  };

  const updateFormStatus = async (formId: string, status: StatusEnum, updatedData) => {
    try {
      return await repository.updateFormStatus(formId, status, updatedData);
    } catch (error) {
      console.error('There was an error while updating the review status of the form', error);
      throw error;
    }
  };

  const deleteForm = async (formId: string) => {
    try {
      return await repository.deleteForm(formId);
    } catch (error) {
      console.error('There was an error while deletiong the form', error);
      throw error;
    }
  };

  const updateFormData = async (formId: string, updatedData) => {
    try {
      return await repository.updateFormData(formId, updatedData);
    } catch (error) {
      console.error('There was an error while updating the review status of the form', error);
      throw error;
    }
  };

  const rollbackFormStatus = async (originalData: draftDataForRollback) => {
    try {
      return await repository.rollbackFormStatus(originalData);
    } catch (error) {
      console.error('There was an error while submitting the form', error);
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

  const getBBs = async (): Promise<Partial<BBRequirement>[]> => {
    try {
      return await repository.getBBs();
    } catch (error) {
      console.error('There was an error while fetching BBs:', error);
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
    getAllBBs,
    getAllSoftwares,
    aggregateComplianceReports,
    getSoftwareComplianceDetail,
    getFormDetail,
    getDraftDetail,
    createOrSubmitForm,
    submitForm,
    updateFormStatus,
    updateFormData,
    deleteForm,
    rollbackFormStatus,
    getBBs,
    editDraftForm,
    getAllBBRequirements,
    getBBRequirements,
  };
};

export default complianceRepository;
