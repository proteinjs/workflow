import express from 'express';
import expressSession from 'express-session';

export interface ServerConfig {
    onStartup?: () => Promise<void>;
    session?: expressSession.SessionOptions;
    authenticate?: (username: string, password: string) => Promise<true|string>;
    staticContent?: {
        staticContentDir?: string;
        /** Relative from `staticContentDir` */
        bundlePaths?: string[];
        /** Relative from `staticContentDir` */
        faviconPath?: string;
    };
    port?: number;
    request?: {
        disableRequestLogging?: boolean;
        beforeRequest?: (request: express.Request, response: express.Response, next: express.NextFunction) => Promise<void>;
        afterRequest?: (request: express.Request, response: express.Response, next: express.NextFunction) => Promise<void>;
        timeoutMs?: number;
    };
}