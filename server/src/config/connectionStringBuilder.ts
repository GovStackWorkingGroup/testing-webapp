type Connection = {
  username: string;
  passwd: string;
  host: string;
  port: string;
  databaseName: string;
  connectionOptions: string;
  [key: string]: string;
}

export class MongoConnection {

  conn: Connection;
  uri: string;
  databaseName: string;
  reconnectInterval: number;

  constructor() {
    this.conn = this.getConnection();
    this.uri = this.buildUri();
    this.databaseName = this.conn.databaseName;
    this.reconnectInterval = 10000;
  }

  getConnection(): {
    username: string;
    passwd: string;
    host: string;
    port: string;
    databaseName: string;
    connectionOptions: string;
  } {
    const envConnectionOptions = process.env.MONGO_CONNECTION_OPTIONS;
    const defaultConnectionOptions = 'maxPoolSize=20&w=majority';
    const conn: Connection = {
      username: process.env.MONGO_USERNAME || '',
      passwd: process.env.MONGO_PASSOWORD || '',
      host: process.env.MONGO_HOST || '',
      port: process.env.MONGO_PORT || '',
      databaseName: process.env.MONGO_DATABASE || '',
      connectionOptions: envConnectionOptions || defaultConnectionOptions,
    };

    const undefinedFields = Object.keys(conn).filter((item) => !conn[item]);
    if (undefinedFields.length > 0) {
      throw new Error(`Some of mandatory environmental variables are missing [${undefinedFields}]`);
    }

    return conn;
  }

  buildUri(): string {
    const uri = 'mongodb://'
            + `${this.conn.username}:${encodeURIComponent(this.conn.passwd)}@`
            + `${this.conn.host}:${this.conn.port}`
            + `/?${this.conn.connectionOptions}`;

    return uri;
  }
}
