import { config } from '../../app.cofig';
import { request } from "../api/request";
import { logger } from "../logging";
import { AlphaVantageDatasource } from './alpha-vanntage';
import { DataSource, SupportedDatasource, SupportedTypes } from "./types";

const DATA_SOURCES: DataSource[] = [
    {
        name: 'alphaVantage',
        id: 1,
        isDefault: true,
        type: 'proxy' 
    }
]

class DatasourceApiManager {
  private instances: Map<string, AlphaVantageDatasource>;
  private datasources: DataSource[];

  constructor() {
    this.instances = new Map();
    this.datasources = [];
  }

  init(datasources?: DataSource[]) {
    this.datasources = datasources || DATA_SOURCES;
    this.datasources.map(ds => {
      const i = this.createInstance(ds);
      this.instances.set(`${ds.name}`, i);
      return i;
    });

    this.setAlphaVantageDatasource();
  }

  private setAlphaVantageDatasource() {
    this.instances.set('alphaVatage', new AlphaVantageDatasource('alphaVatage', { id: null }, request));
  }

  createInstance(datasource: DataSource) {
    switch (datasource.name) {
      case SupportedDatasource.alphaVantage:
        return new AlphaVantageDatasource(datasource.name, { id: datasource.id }, request);
      default:
        logger.debug("DatasourceApiService", `No Supporting datasource class found for ${datasource.name} of type ${datasource.type}`);
    }
  }

  get(dsName: string) {
    const instance = this.instances.get(dsName);

    if (!instance) {
      throw new Error(`Invalid datasource ${dsName}. Either datasource type is not supported or datasource doesn't exist.`);
    }
    return instance;
  }

  getSupportedDatasources(): Record<string, SupportedTypes> {
    const supportedDS: Record<string, SupportedTypes> = {};

    this.instances.forEach(i => {
      if (i) {
        supportedDS[i.name] = i.type;
      }
    });
    return supportedDS;
  }

  getDefault(): AlphaVantageDatasource {
    return this.get(config.defaultDataSource) as AlphaVantageDatasource;
  }
}

const datasourceApiManager = new DatasourceApiManager();
export default datasourceApiManager;
