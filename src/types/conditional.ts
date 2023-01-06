export type IBooleanConditional =
  | IAndConditional
  | IOrConditional
  | IIfConditional
  | IEqConditional
  | INotEqConditional
  | IGtnConditional
  | IGtnEqConditional
  | ILtnConditional
  | ILtnEqConditional
  | IContainsConditional
  | INotContainsConditional
  | ILeastOfConditional
  | IGreatestOfConditional
  | IAnyLtnConditional
  | IAnyLtnEqConditional
  | IAnyGtnConditional
  | IAnyGtnEqConditional
  | IFirstConditional
  | ILastConditional;

export type IMathConditional = IValueConditional | IPureMathConditional;

export type IPureMathConditional =
  | IAddConditional
  | ISubtractConditional
  | IMultiplyConditional
  | IDivideConditional
  | ISumConditional
  | IAvgConditional
  | IMaxConditional
  | IMinConditional
  | IFloorConditional
  | ICeilConditional
  | ICountConditional
  | IAbsConditional
  | IFilterConditional
  | IValueIfConditional;

export type IConditional = IBooleanConditional | IMathConditional;

export type IResolveConditional =
  | IConditional
  | string
  | number
  | boolean
  | Array<any>;

export interface IValueConditional {
  unit: Array<string | number>;
}
export interface IAddConditional {
  condition: '+';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface ISubtractConditional {
  condition: '-';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface IMultiplyConditional {
  condition: '*';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface IDivideConditional {
  condition: '/';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface ISumConditional {
  condition: 'sum';
  right: IMathConditional | Array<number>;
}
export interface IAvgConditional {
  condition: 'avg';
  right: IMathConditional | Array<number>;
}
export interface IMinConditional {
  condition: 'min';
  right: IMathConditional | Array<number>;
}
export interface IMaxConditional {
  condition: 'max';
  right: IMathConditional | Array<number>;
}
export interface IFloorConditional {
  condition: 'floor';
  right: IMathConditional | Array<number>;
}
export interface ICeilConditional {
  condition: 'ceil';
  right: IMathConditional | Array<number>;
}
export interface ICountConditional {
  condition: 'count';
  right: IFilterConditional | IValueConditional | Array<any>;
}
export interface IAbsConditional {
  condition: 'abs';
  right: IMathConditional | number;
}
export interface IFilterConditional {
  condition: 'filter';
  left: IValueConditional | Array<any>;
  right: IBooleanConditional;
}

export interface IValueIfConditional {
  condition: 'value if';
  left: IBooleanConditional;
  right: {
    then: IMathConditional | string | number | boolean;
    else: IMathConditional | string | number | boolean;
  };
}

export interface IFirstConditional {
  condition: 'first';
  right: IFilterConditional | IValueConditional | Array<any>;
}

export interface ILastConditional {
  condition: 'last';
  right: IFilterConditional | IValueConditional | Array<any>;
}

export interface IAndConditional {
  condition: 'and';
  right: Array<IBooleanConditional>;
}
export interface IOrConditional {
  condition: 'or';
  right: Array<IBooleanConditional>;
}
export interface IIfConditional {
  condition: 'if';
  left: IBooleanConditional;
  right: {
    then: IBooleanConditional | boolean;
    else?: IBooleanConditional | boolean;
  };
}
export interface IEqConditional {
  condition: '=';
  left: IMathConditional | string | number | boolean;
  right: IMathConditional | string | number | boolean;
}
export interface INotEqConditional {
  condition: '!=';
  left: IMathConditional | string | number | boolean;
  right: IMathConditional | string | number | boolean;
}
export interface IGtnConditional {
  condition: '>';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface IAnyGtnConditional {
  condition: 'any >';
  left: IMathConditional | Array<number>;
  right: IMathConditional | number;
}
export interface IGtnEqConditional {
  condition: '>=';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface IAnyGtnEqConditional {
  condition: 'any >=';
  left: IMathConditional | Array<number>;
  right: IMathConditional | number;
}
export interface ILtnConditional {
  condition: '<';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface IAnyLtnConditional {
  condition: 'any <';
  left: IMathConditional | Array<number>;
  right: IMathConditional | number;
}
export interface ILtnEqConditional {
  condition: '<=';
  left: IMathConditional | number;
  right: IMathConditional | number;
}
export interface IAnyLtnEqConditional {
  condition: 'any <=';
  left: IMathConditional | Array<number>;
  right: IMathConditional | number;
}
export interface IContainsConditional {
  condition: 'contains';
  left: IMathConditional | Array<any>;
  right: IMathConditional | any;
}
export interface INotContainsConditional {
  condition: 'not contains';
  left: IMathConditional | Array<any>;
  right: IMathConditional | any;
}
export interface ILeastOfConditional {
  condition: 'least of';
  left: IMathConditional | number;
  right: IMathConditional | Array<number>;
}
export interface IGreatestOfConditional {
  condition: 'greatest of';
  left: IMathConditional | number;
  right: IMathConditional | Array<number>;
}
