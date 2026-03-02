// Ambient type declarations for the File Handling API (Project Fugu / Chrome 102+).
// https://developer.chrome.com/docs/capabilities/web-apis/file-handling

interface LaunchParams {
  readonly files: FileSystemFileHandle[];
}

interface LaunchQueue {
  setConsumer(consumer: (params: LaunchParams) => void | Promise<void>): void;
}

interface Window {
  readonly launchQueue?: LaunchQueue;
}
