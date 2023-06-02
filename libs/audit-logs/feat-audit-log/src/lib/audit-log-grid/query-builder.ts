export class WhereBuilder {
  constructor(private rawFilters: any) {}

  transformWhere() {
    const filteredOutput: any = this._filterNullValues(this.rawFilters);
    const fieldConditions =
      this._convertFilterToFieldConditions(filteredOutput);
    if (fieldConditions.length) {
      const firstLevel = this._buildWhereCondition(fieldConditions)
      return this._transformObject(firstLevel);
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

  private _transformObject(obj: Record<string, any>): Record<string, any> {
    const transformedObj: Record<string, any> = {};

    for (const key in obj) {
      const value = obj[key];

      // Split the key by dot to get parent and child keys
      const keyParts = key.split('.');

      // Initialize the current object as the transformed object
      let currentObj: Record<string, any> = transformedObj;

      // Iterate through the key parts
      for (let i = 0; i < keyParts.length; i++) {
        const part = keyParts[i];

        // If it's the last part, assign the value
        if (i === keyParts.length - 1) {
          currentObj[part] = value;
        } else {

          if (!currentObj[part]) {
            currentObj[part] = {};
          }

          // Update the current object to the nested object
          currentObj = currentObj[part];
        }
      }
    }

    return transformedObj;
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
