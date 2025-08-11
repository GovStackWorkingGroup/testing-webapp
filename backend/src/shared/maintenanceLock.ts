// Shared state for maintenance tasks
export let isMaintenanceRunning = false;

export const acquireLock = (): boolean => {
    if (isMaintenanceRunning) {
        return false;
    }
    isMaintenanceRunning = true;
    return true;
};

export const releaseLock = (): void => {
    isMaintenanceRunning = false;
};
