export interface APIRequest {
    paramList: Param[];
  apiKey: string;
  audienceId: number;
}

export interface Param {
    paramKey: string;
  paramValue: string;
}