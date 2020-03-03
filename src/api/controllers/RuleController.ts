import { RuleService } from '../services/RuleService';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import {Fact} from '../models/Fact';
import {
    Body, Param, Post, Get, JsonController
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

class BaseRule {
    public name: string;
}

export class RuleResponse extends BaseRule {
    public enabled: string;
}

export class RuleExecuteRequest {
    @IsNotEmpty()
    public name: string;
    @IsNumber()
    public age: number;
    @IsString()
    public social: string;
}

export class RuleExecuteResponse {
    public haveRecommendation: string;
}

@JsonController('/rules')
@OpenAPI({ security: [{ basicAuth: [] }] })
export class RuleController {
    constructor(
        private ruleService: RuleService,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    @Get()
    @ResponseSchema(RuleResponse)
    public find(): Promise<RuleResponse> {
        this.ruleService.find();
        return new Promise((resolve) => {
            resolve({name: "test", enabled: "true"});
        });
    }

    @Post('/:ruleVersion/execute')
    @ResponseSchema(RuleExecuteResponse)
    public execute(@Param('ruleVersion') ruleVersion: string,
                   @Body({required: true}) body: RuleExecuteRequest): RuleExecuteResponse {
        const fact = new Fact();
        fact.name = body.name;
        fact.age = body.age;
        fact.social = body.social;

        this.log.info("ruleVersion", ruleVersion);
        this.ruleService.execute(fact);

        return {haveRecommendation: "TRUE"};
    }
}
