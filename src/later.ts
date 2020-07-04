import {Core} from './later-core';

import {IParse, parseFactory} from './parse/parse';

export class Later extends Core {
    parse: IParse;

    constructor() {
        super();
        this.parse = parseFactory(this);
    }
}
