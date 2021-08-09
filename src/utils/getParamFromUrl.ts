import queryString, { ParsedQuery } from "query-string";

export type UrlValueType = string | boolean | number;

export interface UrlParamsKeyValue {
  key: string;
  value: UrlValueType;
}

const EMPTY_STRING = '';

function getParamFromUrl(key: string): UrlValueType {
  const values: ParsedQuery<UrlValueType> = queryString.parse(window.location.search);

  return values[key] ? values[key] as UrlValueType : EMPTY_STRING;
}

export {
    getParamFromUrl
};
