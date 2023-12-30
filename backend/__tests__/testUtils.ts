import { expect } from 'chai';
import mongoose from 'mongoose';

class ReportChecker {
  private static reportHasKeys(reports: mongoose.Document[], requiredKeys: string[], optionalKeys: string[] = []) {
    reports.forEach(report => {
      const reportObj = report.toObject({ virtuals: true });
      const reportKeys = Object.keys(reportObj);

      // Check for required keys
      requiredKeys.forEach(key => {
        expect(reportObj, `Report is missing required key: ${key}`).to.have.property(key);
      });

      // Check for unexpected keys
      reportKeys.forEach(key => {
        if (!requiredKeys.includes(key) && !optionalKeys.includes(key)) {
          const value = reportObj[key];
          if (!(Array.isArray(value) && value.length === 0) && 
              value !== null && 
              value !== undefined && 
              !(typeof value === 'object' && Object.keys(value).length === 0)) {
            expect.fail(`Unexpected key found in report: ${key}`);
          }
        }
      });
    });
  }

  public static checkReports(reports: mongoose.Document[], requiredKeys: string[], optionalKeys: string[] = []) {
    this.reportHasKeys(reports, requiredKeys, optionalKeys);
  }
}

export default ReportChecker;
