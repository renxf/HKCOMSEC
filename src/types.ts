export type LogType = 'info' | 'success' | 'error' | 'warning';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: LogType;
}

export interface CompanyNameInfo {
  chineseName: string;
  englishName: string;
}

export interface SearchResult {
  isAvailable: boolean;
  conflictingNames?: string[];
  remarks?: string;
  checkedAt: string;
}
