export class WhereBuilder {
  constructor(private rawFilters: any) {}

  transformWhere() {
    const filteredOutput: any = this._filterNullValues(this.rawFilters);
    const fieldConditions =
      this._convertFilterToFieldConditions(filteredOutput);
    if (fieldConditions.length) {
      return this._buildWhereCondition(fieldConditions);
    } else return null;
  }

  private _filterNullValues(obj: any): any {
    const filteredObj: any = {};
    for (const key in obj) {
      if (obj[key][0].value !== null) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  }

  private _convertFilterToFieldConditions(filter: {
    [key: string]: FilterValue[];
  }): FieldCondition[] {
    const fieldConditions: FieldCondition[] = [];

    for (const key in filter) {
      const fieldCondition: FieldCondition = {
        fieldName: key,
        conditions: {},
      };

      const values = filter[key];
      for (const value of values) {
        const { matchMode, value: conditionValue } = value;
        const mapperKey = Object.keys(Mapper).find(
          key => Mapper[key as keyof typeof Mapper] === matchMode
        );

        if (mapperKey) {
          fieldCondition.conditions[mapperKey as keyof typeof Mapper] =
            conditionValue;
        }
      }

      fieldConditions.push(fieldCondition);
    }

    return fieldConditions.map(({ fieldName, conditions }) => ({
      fieldName,
      conditions,
    }));
  }

  private _buildWhereCondition(
    fieldConditions: { fieldName: string; conditions: any }[]
  ) {
    const whereCondition: any = {};

    for (const { fieldName, conditions } of fieldConditions) {
      whereCondition[fieldName] = {};

      for (const [conditionKey, conditionValue] of Object.entries(conditions)) {
        whereCondition[fieldName][conditionKey] = conditionValue;
      }
    }

    return whereCondition;
  }
}

export interface FilterValue {
  value: string;
  matchMode: keyof typeof Mapper;
  operator: string;
}

export interface FieldCondition {
  fieldName: string;
  conditions: { [key in keyof typeof Mapper]?: string };
  operator?: string;
}

export const Mapper = {
  equals: 'eq',
  notEquals: 'neq',
  contains: 'contains',
  notContains: 'ncontains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
};
