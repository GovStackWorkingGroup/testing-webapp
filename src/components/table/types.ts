export type SortSoftwareTableFieldType =
  | 'testApp'
  | 'overallCompatibility'
  | 'lastUpdate';

export type SortResultTableFieldType = 'status' | 'uri' | 'name';

export type SoftwaresTablColumnSortType = {
  field: SortSoftwareTableFieldType;
  order: 'desc' | 'asc' | null;
};

export type ResultTableColumnSortType = {
  field: SortResultTableFieldType;
  order: 'desc' | 'asc' | null;
};

export type SoftwaresTableSortByType = {
  testApp: SoftwaresTablColumnSortType;
  overallCompatibility: SoftwaresTablColumnSortType;
  lastUpdate: SoftwaresTablColumnSortType;
};

export type ResultTableSortByType = {
  status: ResultTableColumnSortType;
  uri: ResultTableColumnSortType;
  name: ResultTableColumnSortType;
};
