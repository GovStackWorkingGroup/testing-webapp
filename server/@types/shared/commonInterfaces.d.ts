declare namespace CommonTypes {
    type Request = import('express').Request;

    interface Conn {
        username: string;
        passwd: string;
        host: string;
        port: string;
        databaseName: string;
        connectionOptions: string;
    }

    interface MongoConnection {
        conn: Conn;
        uri: string;
        databaseName: string;
        reconnectInterval: number;
    }

    interface Config {
        appName: string;
        isProduction: boolean;
        mongoConnection: MongoConnection;
    }

    interface MulterRequest extends Request {
        files?: any;
        body: any;
    }
}
