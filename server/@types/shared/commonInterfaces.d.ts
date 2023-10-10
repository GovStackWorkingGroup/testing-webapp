export interface Conn {
    username: string;
    passwd: string;
    host: string;
    port: string;
    databaseName: string;
    connectionOptions: string;
}

export interface MongoConnection {
    conn: Conn;
    uri: string;
    databaseName: string;
    reconnectInterval: number;
}

export interface Config {
    appName: string;
    isProduction: boolean;
    mongoConnection: MongoConnection;
}

export interface MulterRequest extends Request {
    files?: any;
    body?: any;
}