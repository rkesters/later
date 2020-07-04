import {Later} from "./later";
declare global {
     module NodeJS {
        interface Global {
            later: Later;
        }
    }
}
