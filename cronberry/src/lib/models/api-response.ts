export interface APIRequest {
    paramList: Param[];
  apiKey: string;
  audienceId: string;
}

export interface Param {
    paramKey: string;
  paramValue: string;
}