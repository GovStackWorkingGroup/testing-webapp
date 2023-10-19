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

  getConnection(): Connection {
    const conn: Partial<Connection> = {
      username: process.env.MONGO_USERNAME,
      passwd: process.env.MONGO_PASSOWORD,
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
      databaseName: process.env.MONGO_DATABASE,
      connectionOptions: process.env.MONGO_CONNECTION_OPTIONS || 'maxPoolSize=20&w=majority',
    };

    Object.entries(conn).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`parameter ${key} is undefined`);
      }
    });

    return conn as Connection;
  }

  buildUri(): string {
    const uri = 'mongodb://'
      + `${this.conn.username}:${encodeURIComponent(this.conn.passwd)}@`
      + `${this.conn.host}:${this.conn.port}`
      + `/?${this.conn.connectionOptions}`;
    return uri;
  }
}
