export type UrlImportErrorCode =
  | 'INVALID_URL'
  | 'UNSUPPORTED_HOST'
  | 'FETCH_TIMEOUT'
  | 'UNSUPPORTED_CONTENT_TYPE'
  | 'CONTENT_TOO_LARGE'
  | 'PARSE_FAILED'
  | 'INTERNAL_ERROR';

export interface UrlImportRequestBody {
  url: string;
}

export interface UrlImportSuccessResponse {
  markdown: string;
  title: string;
  sourceUrl: string;
  fetchedAt: string;
}

export interface UrlImportErrorResponse {
  error: {
    code: UrlImportErrorCode;
    message: string;
  };
}
