import { SessionData, SessionDataStorage } from './Session';
declare let proteinjs: any;

export class BrowserSessionDataStorage implements SessionDataStorage {
    environment = 'browser' as 'browser';

    setData(data: SessionData) {
        // set in global via SessionDataScriptTag
    }

    getData(): SessionData {
        return proteinjs['sessionData'];
    }
}