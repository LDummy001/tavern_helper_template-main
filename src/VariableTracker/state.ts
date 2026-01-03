import { Variable } from './variable';

export class State {
  protected state: Map<string, Variable>;

  constructor(state?: State) {
    if (state) this.state = state.state;
    else this.state = new Map();
  }

  static fromVariables(variables: Record<string, any> | null): State {
    const state = new State();
    if (variables === null) return state;
    for (const [key, variable_record] of Object.entries(variables)) {
      const variable = Variable.registry.get(variable_record.type)?.fromObject(variable_record.values);
      if (variable) state.setVariable(key, variable);
    }
    return state;
  }

  public toVariables(): Record<string, any> {
    const variables: Record<string, any> = {};
    for (const [key, variable] of this.state) {
      variables[key] = {
        type: variable.TYPE,
        values: variable.getValue(),
      };
    }
    return variables;
  }

  public getVariable(key: string): Variable | null {
    return this.state.get(key) ?? null;
  }

  public setVariable(key: string, variable: Variable): void {
    this.state.set(key, variable);
  }

  public deleteVariable(key: string): void {
    this.state.delete(key);
  }
}
