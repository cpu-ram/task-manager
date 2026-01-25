import { exportData } from './getData';

export function downloadExportData(
  args?: {
    fileName?: string;
  }): void {

  const fileName = args?.fileName ?? 'task_data.json';

  const dataStr: string = exportData();
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}