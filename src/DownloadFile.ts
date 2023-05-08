import { saveAs } from "file-saver";

export function downloadFile(filename: string, content: string, contentType = "text/plain;charset=utf-8"): void {
  const blob = new Blob([content], { type: contentType });
  saveAs(blob, filename);
}
