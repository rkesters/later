import { compileFactory } from './core/compile';
import { scheduleFactory } from './core/schedule';
import { laterSetIntervalFactory } from './core/setinterval';
import { laterSetTimeoutFactory } from './core/settimeout';
import { Base } from './later-base';


export class Core extends Base {
    public compile = compileFactory(this);
    public schedule = scheduleFactory(this);
    public setTimeout = laterSetTimeoutFactory(this);
    public setInterval = laterSetIntervalFactory(this);
}
