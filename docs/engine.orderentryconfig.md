<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@card-games/engine](./engine.md) &gt; [OrderEntryConfig](./engine.orderentryconfig.md)

## OrderEntryConfig type

Intermediary type for ordered entries with fallback (\*)

even and odd bot yet supported

<b>Signature:</b>

```typescript
export type OrderEntryConfig<T = any> = {
    '*'?: T;
    odd?: T;
    even?: T;
    [key: string]: T | undefined;
};
```
