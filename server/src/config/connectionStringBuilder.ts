export class MongoConnection {

  conn: {
    username: string | undefined;
    passwd: string | undefined;
    host: string | undefined;
    port: string | undefined;
    databaseName: string | undefined;
    connectionOptions: string;
  };
  
  uri: string;
  databaseName: string | undefined;
  reconnectInterval: number;

  constructor() {
    this.conn = this.getConnection();
    this.uri = this.buildUri();
    this.databaseName = this.conn.databaseName;
    this.reconnectInterval = 10000;
  }
  getConnection = () => {
    const envConnectionOptions = process.env.MONGO_CONNECTION_OPTIONS;
    const defaultConnectionOptions = 'maxPoolSize=20&w=majority';
    const conn = {
      username: process.env.MONGO_USERNAME,
      passwd: process.env.MONGO_PASSOWORD,
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
      databaseName: process.env.MONGO_DATABASE,
      connectionOptions: envConnectionOptions || defaultConnectionOptions,
    };

    const undefinedFields = Object.keys(conn).filter((item) => !conn[item]);
    if (undefinedFields.length > 0) {
      throw new Error(`Some of mandatory environmental variables are missing [${undefinedFields}]`);
    }

    return conn;
  }

  buildUri = () => {
    if(!this.conn.username || !this.conn.passwd || !this.conn.host || !this.conn.port) {
      throw new Error("Required connection details are missing.");
    }
    const uri = 'mongodb://'
            + `${this.conn.username}:${encodeURIComponent(this.conn.passwd)}@`
            + `${this.conn.host}:${this.conn.port}`
            + `/?${this.conn.connectionOptions}`;

    return uri;
  }
};
