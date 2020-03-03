import { Service } from 'typedi';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import {Fact} from '../models/Fact';
import { Engine, Rule } from 'json-rules-engine';

@Service()
export class RuleService {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
    ) { }

    public find() {
        this.log.info('Find rules service');
    }

    public execute(fact: Fact) {
        let engine = new Engine();
        const rule = new Rule({
            // define the 'conditions' for when "hello world" should display
            conditions: {
                all: [{
                    fact: 'displayMessage',
                    operator: 'equal',
                    value: true,
                }]
            },
            // define the 'event' that will fire when the condition evaluates truthy
            event: {
                type: 'message',
                params: {
                    data: 'hello-world!'
                }
            }
        });

        engine.addRule(rule);

        const facts = { displayMessage: true };

        // run the engine
        engine
            .run(facts)
            .then(results => { // engine returns an object with a list of events with truthy conditions
                this.log.info('DONE SOME THING');
                results.events.map(event => this.log.info(event.params.data));
            })
            .catch(this.log.error);


        this.log.info('LOG FACT', fact);
    }
}
