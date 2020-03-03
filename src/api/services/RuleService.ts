import { Service } from 'typedi';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import {Fact} from '../models/Fact';

@Service()
export class RuleService {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
    ) { }

    public find() {
        this.log.info('Find rules service');
    }

    public execute(fact: Fact) {
        this.log.info("LOG FACT", fact);
    }
}
