import { StatusEnum } from 'myTypes';
import ComplianceReport from '../db/schemas/compliance'

export async function removeSensitiveDataFromExpiredDrafts() {
    try {
        const currentDateTime = new Date();
        const query = {
            status: StatusEnum.DRAFT,
            expirationDate: { $lt: currentDateTime }
        };
        console.log('Searching for expired compliance form drafts to remove sensitive data...');
        console.log('Query:', query);

        const result = await ComplianceReport.updateMany(query, [
            {
                $unset: [
                    "status",
                    "softwareName",
                    "logo",
                    "website",
                    "documentation",
                    "pointOfContact",
                    "compliance",
                    "description"
                ]
            }
        ]);
        
        if (result.matchedCount > 0) {
            console.log(`Found and updated ${result.matchedCount} expired drafts. Removed sensitive data.`);
        } else {
            console.log('No expired drafts found.');
        }

    } catch (error) {
        console.error('An error occurred while removing sensitive data from expired drafts:', error);
    }
}

export default removeSensitiveDataFromExpiredDrafts;
