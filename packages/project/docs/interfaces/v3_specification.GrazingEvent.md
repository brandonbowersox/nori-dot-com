[@nori-dot-com/project](../README.md) / [v3-specification](../modules/v3_specification.md) / GrazingEvent

# Interface: GrazingEvent

[v3-specification](../modules/v3_specification.md).GrazingEvent

Grazing event details.

**`example`**

```js
{
 "restPeriod": 0,
 "utilization": 20,
 "startDate": "01/01/2000",
 "endDate": "12/31/2000"
}
```

## Hierarchy

- [`CropEventRange`](v3_specification.CropEventRange.md)

  ↳ **`GrazingEvent`**

## Table of contents

### Properties

- [endDate](v3_specification.GrazingEvent.md#enddate)
- [restPeriod](v3_specification.GrazingEvent.md#restperiod)
- [startDate](v3_specification.GrazingEvent.md#startdate)
- [utilization](v3_specification.GrazingEvent.md#utilization)

## Properties

### endDate

• **endDate**: `string`

The last date that the event occurred (formatted as MM/DD/YYYY and YYYY > 2000 and YYYY < 2100).

**`pattern`** ^02\/(?:[01]\d|2\d)\/(?:20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:20)\d{2}$

**`example`** When the end date of the event range was on December 31st of 2000:

```js
"endDate": "12/31/2000"
```

#### Inherited from

[CropEventRange](v3_specification.CropEventRange.md).[endDate](v3_specification.CropEventRange.md#enddate)

#### Defined in

[v3-specification.ts:1321](https://github.com/nori-dot-eco/nori-dot-com/blob/841b22c/packages/project/src/v3-specification.ts#L1321)

___

### restPeriod

• **restPeriod**: `number`

The grazing rest period in days.

Zero and one are equivalent and indicate continuous grazing.

**`minimum`** 0

**`maximum`** 365

**`example`** When animals are grazing continuously:

```js
"restPeriod": 0
```

**`example`** When animals are on the field or in each paddock within the field every 30 days:

```js
"restPeriod": 30
```

#### Defined in

[v3-specification.ts:1889](https://github.com/nori-dot-eco/nori-dot-com/blob/841b22c/packages/project/src/v3-specification.ts#L1889)

___

### startDate

• **startDate**: `string`

The first date that the event occurred (formatted as MM/DD/YYYY and YYYY > 2000 and YYYY < 2100).

**`pattern`** ^02\/(?:[01]\d|2\d)\/(?:20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:20)\d{2}$

**`example`** When the start date of the event range was on January 1st of 2000:

```js
"startDate": "01/01/2000"
```

#### Inherited from

[CropEventRange](v3_specification.CropEventRange.md).[startDate](v3_specification.CropEventRange.md#startdate)

#### Defined in

[v3-specification.ts:1308](https://github.com/nori-dot-eco/nori-dot-com/blob/841b22c/packages/project/src/v3-specification.ts#L1308)

___

### utilization

• **utilization**: `number`

The percentage of forage consumed by the animals per rest period days.

**`minimum`** 0

**`maximum`** 100

**`example`** When 20% of the forage was consumed per period:

```js
"utilization": 20
```

#### Defined in

[v3-specification.ts:1903](https://github.com/nori-dot-eco/nori-dot-com/blob/841b22c/packages/project/src/v3-specification.ts#L1903)
