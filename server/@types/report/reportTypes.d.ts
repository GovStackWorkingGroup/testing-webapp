import {ProductMetaData, MetaSchema} from './reportInterfaces';

type MetaYamlOutput = ProductMetaData & MetaSchema;

type SortOrder = 'asc' | 'desc';
type QueryParams = Record<string, SortOrder>;
type MongoMapping = Record<string, string>;