<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@card-games/engine](./engine.md) &gt; [IValidHandStraightStruct](./engine.ivalidhandstraightstruct.md)

## IValidHandStraightStruct type

Straight hand struct count must be &gt;<!-- -->= 2

<b>Signature:</b>

```typescript
export type IValidHandStraightStruct = {
    kind: 'straight';
    count: number;
    allowMore?: boolean;
    flush?: boolean;
};
```
