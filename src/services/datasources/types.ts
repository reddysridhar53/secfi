export interface DatasourceSettings {
    id: number;
};

export type SupportedTypes = "alphaVantage";

export const SupportedDatasource: Record<SupportedTypes, string> = {
    alphaVantage: "alphaVantage",
};

export interface DataSource {
    access?: string;
    id: number;
    isDefault?: boolean;
    name: string;
    type?: string;
}
