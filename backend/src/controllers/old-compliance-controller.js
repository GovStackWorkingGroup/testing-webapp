const ComplianceReport = require('../models/ComplianceReport');

exports.getList = async (req, res, next) => {
    try {
        // Query the database
        const reports = await ComplianceReport.find({});
        let result = {};

        reports.forEach(report => {
            let softwareName = report.softwareName;
            result[softwareName] = report.compliance.map(complianceVersion => ({
                softwareVersion: complianceVersion.version,
                bb: complianceVersion.bbDetails.get('bbSpecification'),
                bbVersion: complianceVersion.bbDetails.get('bbVersion'),
                status: complianceVersion.bbDetails.get('status'),
                submissionDate: complianceVersion.bbDetails.get('submissionDate'),
                deploymentCompliance: complianceVersion.bbDetails.get('deploymentCompliance').isCompliant,
                requirementSpecificationCompliance: complianceVersion.bbDetails.get('requirementSpecification').level,
                interfaceCompliance: complianceVersion.bbDetails.get('interface').level
            }));
        });

        // Send back the result
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch data.',
            details: error.message
        });
    }
};