import { Router } from 'express';
import { removeSensitiveDataFromExpiredDrafts } from '../cronJobs/removeExpiredDrafts';
import syncGitBookBBRequirements from '../cronJobs/syncGitBookBBRequirements';
import verifyGithubToken from '../middlewares/requiredAuthMiddleware';
import { acquireLock, releaseLock } from '../shared/maintenanceLock';

const router = Router();

router.post('/sync', verifyGithubToken, async (_req, res) => {
    if (!acquireLock()) {
        return res.status(409).json({ 
            success: false, 
            message: 'Maintenance is already in progress' 
        });
    }

    try {
        // Run both maintenance tasks sequentially
        await removeSensitiveDataFromExpiredDrafts();
        await syncGitBookBBRequirements();
        
        return res.json({ 
            success: true, 
            message: 'Maintenance tasks completed successfully' 
        });
    } catch (error) {
        console.error('Error during maintenance:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error during maintenance tasks',
            error: error instanceof Error ? error.message : String(error)
        });
    } finally {
        releaseLock();
    }
});

export default router;
