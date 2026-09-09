import { Report } from '@/types';
import { MOCK_REPORTS } from '@/data/mockReports';

export const reportService = {
  async getReports(): Promise<Report[]> {
    await delay(300);
    return MOCK_REPORTS;
  },

  async getReportById(id: string): Promise<Report | null> {
    await delay(200);
    return MOCK_REPORTS.find(r => r.id === id) ?? null;
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
