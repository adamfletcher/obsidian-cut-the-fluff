export interface Rulesets {
    weakQualifiers: Record<string, string>;
    jargon: Record<string, string>;
    complexity: Record<string, string>;
    redundancies: Record<string, string>;
}

export const enum RuleType {
    WeakQualifier = "WeakQualifier",
    Jargon = "Jaron",
    Complexity = "Complexity",
    Redundancy = "Redudancy",
    Custom = "Custom",
    AiSlop = "AiSlop"
}

export class Rule {
    match: string;
    //alternatives: string[];
    highlightLength: number | null;
    highlightOffset: number;
    type: RuleType;

    constructor(type: RuleType, match: string, highLightOffset: number = 0, highlightLength: number | null = null) {
        this.type = type;
        this.match = match.toLowerCase();
        this.highlightOffset = highLightOffset;
        this.highlightLength = highlightLength;
    }
}

export class Rules {
    rules: Record<string, Rule> = {};
    customRules: Record<string, Rule> = {};

    constructor() {
        
        this.addRule(new Rule(RuleType.WeakQualifier, "a bit"));
        this.addRule(new Rule(RuleType.WeakQualifier, "a little"));
        this.addRule(new Rule(RuleType.WeakQualifier, "actual"));
        this.addRule(new Rule(RuleType.WeakQualifier, "actually"));
        this.addRule(new Rule(RuleType.WeakQualifier, "basically"));
        this.addRule(new Rule(RuleType.WeakQualifier, "just"));
        this.addRule(new Rule(RuleType.WeakQualifier, "kind of"));
        this.addRule(new Rule(RuleType.WeakQualifier, "like"));
        this.addRule(new Rule(RuleType.WeakQualifier, "literally"));
        this.addRule(new Rule(RuleType.WeakQualifier, "quite"));
        this.addRule(new Rule(RuleType.WeakQualifier, "really"));
        this.addRule(new Rule(RuleType.WeakQualifier, "simply"));
        this.addRule(new Rule(RuleType.WeakQualifier, "sort of"));
        this.addRule(new Rule(RuleType.WeakQualifier, "very"));
        this.addRule(new Rule(RuleType.WeakQualifier, "somewhat"));

        this.addRule(new Rule(RuleType.Jargon, "at the end of the day"));
        this.addRule(new Rule(RuleType.Jargon, "boil the ocean"));
        this.addRule(new Rule(RuleType.Jargon, "double-edged sword"));
        this.addRule(new Rule(RuleType.Jargon, "going forward"));
        this.addRule(new Rule(RuleType.Jargon, "i beg to differ"));
        this.addRule(new Rule(RuleType.Jargon, "ideate"));
        this.addRule(new Rule(RuleType.Jargon, "move the needle"));
        this.addRule(new Rule(RuleType.Jargon, "moving forward"));
        this.addRule(new Rule(RuleType.Jargon, "paradigm"));
        this.addRule(new Rule(RuleType.Jargon, "paradigm shift"));
        this.addRule(new Rule(RuleType.Jargon, "rightsizing"));
        this.addRule(new Rule(RuleType.Jargon, "singing from the same hymn sheet"));
        this.addRule(new Rule(RuleType.Jargon, "touch base"));
        this.addRule(new Rule(RuleType.Jargon, "unpack"));
        this.addRule(new Rule(RuleType.Jargon, "north star"));

        

        this.addRule(new Rule(RuleType.Complexity, "as of yet"));
        this.addRule(new Rule(RuleType.Complexity, "at the present time"));
        this.addRule(new Rule(RuleType.Complexity, "close proximity"));
        this.addRule(new Rule(RuleType.Complexity, "commence"));
        this.addRule(new Rule(RuleType.Complexity, "deem"));
        this.addRule(new Rule(RuleType.Complexity, "dialogue"));
        this.addRule(new Rule(RuleType.Complexity, "due to the fact that"));
        this.addRule(new Rule(RuleType.Complexity, "endeavor"));
        this.addRule(new Rule(RuleType.Complexity, "endeavour"));
        this.addRule(new Rule(RuleType.Complexity, "enumerate"));
        this.addRule(new Rule(RuleType.Complexity, "equitable"));
        this.addRule(new Rule(RuleType.Complexity, "erroneous"));
        this.addRule(new Rule(RuleType.Complexity, "facilitate"));
        this.addRule(new Rule(RuleType.Complexity, "For all intents and purposes"));
        this.addRule(new Rule(RuleType.Complexity, "henceforth"));
        this.addRule(new Rule(RuleType.Complexity, "herewith"));
        this.addRule(new Rule(RuleType.Complexity, "honestly"));
        this.addRule(new Rule(RuleType.Complexity, "in a sense"));
        this.addRule(new Rule(RuleType.Complexity, "in lieu of"));
        this.addRule(new Rule(RuleType.Complexity, "in my humble opinion"));
        this.addRule(new Rule(RuleType.Complexity, "in order to"));
        this.addRule(new Rule(RuleType.Complexity, "in regard to"));
        this.addRule(new Rule(RuleType.Complexity, "in relation to"));
        this.addRule(new Rule(RuleType.Complexity, "in the event of"));
        this.addRule(new Rule(RuleType.Complexity, "inception"));
        this.addRule(new Rule(RuleType.Complexity, "leverage"));
        this.addRule(new Rule(RuleType.Complexity, "numerous"));
        this.addRule(new Rule(RuleType.Complexity, "per se"));
        this.addRule(new Rule(RuleType.Complexity, "pertaining to"));
        this.addRule(new Rule(RuleType.Complexity, "prior to"));
        this.addRule(new Rule(RuleType.Complexity, "subsequently"));
        this.addRule(new Rule(RuleType.Complexity, "utilise"));
        this.addRule(new Rule(RuleType.Complexity, "utilize"));
        this.addRule(new Rule(RuleType.Complexity, "of the opinion that"));
        this.addRule(new Rule(RuleType.Complexity, "with reference to"));
        this.addRule(new Rule(RuleType.Complexity, "with the exception of"));
        this.addRule(new Rule(RuleType.Complexity, "i might add"));
        this.addRule(new Rule(RuleType.Complexity, "it is interesting to note"));

        this.addRule(new Rule(RuleType.Redundancy, "combine together", 7));
        this.addRule(new Rule(RuleType.Redundancy, "critically important", 8));
        this.addRule(new Rule(RuleType.Redundancy, "each and every", 0, 9));

        
        this.addRule(new Rule(RuleType.Redundancy, "successfully complete", 0, 13));
        this.addRule(new Rule(RuleType.Redundancy, "basic fundamentals"));
        this.addRule(new Rule(RuleType.Redundancy, "in the event that"));
        this.addRule(new Rule(RuleType.Redundancy, "one and the same", 0, 8));
        this.addRule(new Rule(RuleType.Redundancy, "final conclusion", 0, 6));

        this.addRule(new Rule(RuleType.AiSlop, "doing real work"));
        this.addRule(new Rule(RuleType.AiSlop, "genuine tension"));
        this.addRule(new Rule(RuleType.AiSlop, "load-bearing"));
        this.addRule(new Rule(RuleType.AiSlop, "load bearing"));
        this.addRule(new Rule(RuleType.AiSlop, "that distinction matters"));
        this.addRule(new Rule(RuleType.AiSlop, "delve"));
        this.addRule(new Rule(RuleType.AiSlop, "tapestry"));
        this.addRule(new Rule(RuleType.AiSlop, "landscape"));
        this.addRule(new Rule(RuleType.AiSlop, "here's the thing"));
        this.addRule(new Rule(RuleType.AiSlop, "think of it"));
        this.addRule(new Rule(RuleType.AiSlop, "unpack"));
        this.addRule(new Rule(RuleType.AiSlop, "let's explore"));
        this.addRule(new Rule(RuleType.AiSlop, "break it down"));
        this.addRule(new Rule(RuleType.AiSlop, "pivotal"));

    }

    private addRule(rule: Rule) : void {
        this.rules[rule.match] = rule;
    }

    public resetCustomRules() : void {
        this.customRules = {};
    }

    public addCustomRule(match: string) : void {
        this.customRules[match] = new Rule(RuleType.Custom, match);
    }

    public getRuleByMatchString(match: string): Rule {

        match = match.toLowerCase();

        if(match in this.rules) {
            return this.rules[match];
        } else {
            return this.customRules[match];
        }

    }

    public getMatchStrings(types: RuleType[], exclusions: string[]): string[] {
        let toReturn: string[] = [];

        for (let key in this.rules) {
            if (types.includes(this.rules[key].type) && !exclusions.includes(key)) {
                toReturn.push(key);
            }
        }

        for (let key in this.customRules) {
            toReturn.push(key);
        }

        // Sort by length so more precise matches take priority
        return toReturn.sort((a, b) => b.length - a.length);;
    }

}