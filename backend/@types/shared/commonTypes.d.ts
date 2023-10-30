type Filters = {
  limit?: number;
  offset?: number;
  branch?: string;
};

type SortOrder = 'asc' | 'desc';
type QueryParams = Record<string, SortOrder>;
type MongoMapping = Record<string, string>;

type Connection = {
  username: string;
  passwd: string;
  host: string;
  port: string;
  databaseName: string;
  connectionOptions: string;
  [key: string]: string ;
}