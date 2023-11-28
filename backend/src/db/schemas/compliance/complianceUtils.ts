import { ComplianceReport } from "myTypes";

export const StatusEnum = {
    DRAFT: 0,
    IN_REVIEW: 1,
    APPROVED: 2,
    REJECTED: 3
};

export const BBStatusEnum = {
    IN_REVIEW: 1,
    APPROVED: 2,
    REJECTED: 3
}

export const RequirementStatusEnum = {
    REQUIRED: 0,
    RECOMMENDED: 1,
    OPTIONAL: 2
};

export const SpecificationComplianceLevel = {
    NA: -1,
    LEVEL_1: 1,
    LEVEL_2: 2
};

export const RequirementFulfillment = {
    NA: -1,
    MET: 1,
    NOT_MET: 0
};

export const isParentStatusDraft = function (this): boolean {
    const parent = this.parent();
    return parent?.status == StatusEnum.DRAFT;
};

export const isGrandparentStatusDraft = function (this): boolean {
    const grandparent = this.parent()?.parent();
    return grandparent?.status == StatusEnum.DRAFT;
};

export const validateRequiredString2 = function (this, value: any): boolean {
    return typeof value === 'string' &&
        (isParentStatusDraft.call(this) || value.trim().length > 0);
};

export const validateRequiredString = function (this, value: any): boolean {
    return typeof value === 'string' &&
        (isParentStatusDraft.call(this) || value.trim().length > 0);
};

export const validateComplianceDetailRequiredString = function (this, value: any): boolean {
    return typeof value === 'string' &&
        (isGrandparentStatusDraft.call(this) || value.trim().length > 0);
};

export const validateRequiredList = function (this, value: any): boolean {
    return isParentStatusDraft.call(this) ||
        (Array.isArray(value) && value.length > 0);
};

export const validateRequiredObject = function (this, value: any): boolean {
    return isParentStatusDraft.call(this) ||
        (typeof value === 'object' && value !== null && Object.keys(value).length > 0);
};

export const validateComplianceDetailObject = function (this, value: any): boolean {
    return isGrandparentStatusDraft.call(this) ||
        (typeof value === 'object' && value !== null && Object.keys(value).length > 0);
};

export const validateRequirements = (requirements) => {
    if (!Array.isArray(requirements)) {
        return { isValid: false, errors: ["Requirements is not an array"] };
    }

    const errors = requirements
        .filter(req => req.status === RequirementStatusEnum.REQUIRED && ![0, 1].includes(req.fulfillment))
        .map(req => `Required '${req.requirement}' unfulfilled`);

    return { isValid: errors.length === 0, errors };
};
