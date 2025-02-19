export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  REDIRECT = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum WS_TransportEvents {
  Connected = 'connected',
  Close = 'close',
  Error = 'error',
  Message = 'message'
}

export enum WS_EVENTS {
  Open = 'open',
  Message = 'message',
  Error = 'error',
  Close = 'close',
}

export const enum ERRORS_MESSAGES {
  USER_IN_SYSTEM = 'User already in system',
  USER_REQUIRED = 'User is required',
  LOGOUT_FAILED = 'Failed to logout',
  NETWORK = 'Network Error',
  ABORTED = 'Request aborted',
  TIMEOUT = 'Timeout exceeded',
  ERROR = 'Error',
  WS_ALREADY_CONNECTED = 'Connection is already established',
  WS_NOT_CONNECTED = 'Connection is not established',
}

export enum STORE_EVENTS {
  Updated = 'updated'
}
