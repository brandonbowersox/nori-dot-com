[@nori-dot-com/project](../README.md) / [v4-specification](../modules/v4_specification.md) / CropEvent

# Interface: CropEvent

[v4-specification](../modules/v4_specification.md).CropEvent

A crop event that happened on a particular date.

**`example`**

```js
{
 "date": "2000-01-01",
 "externalId": "f1-corn1-1234",
 "id": "faec5e0b-8ce2-4161-93ff-4c9734f22334"
}
```

## Hierarchy

- **`CropEvent`**

  ↳ [`PlantingEvent`](v4_specification.PlantingEvent.md)

  ↳ [`HarvestEvent`](v4_specification.HarvestEvent.md)

  ↳ [`SoilOrCropDisturbanceEvent`](v4_specification.SoilOrCropDisturbanceEvent.md)

  ↳ [`FertilizerEvent`](v4_specification.FertilizerEvent.md)

  ↳ [`OrganicMatterEvent`](v4_specification.OrganicMatterEvent.md)

  ↳ [`IrrigationEvent`](v4_specification.IrrigationEvent.md)

  ↳ [`LimingEvent`](v4_specification.LimingEvent.md)

  ↳ [`GrazingEvent`](v4_specification.GrazingEvent.md)

  ↳ [`PruningEvent`](v4_specification.PruningEvent.md)

  ↳ [`ClearingAndRenewalEvent`](v4_specification.ClearingAndRenewalEvent.md)

  ↳ [`BurningEvent`](v4_specification.BurningEvent.md)

## Table of contents

### Properties

- [date](v4_specification.CropEvent.md#date)
- [externalId](v4_specification.CropEvent.md#externalid)
- [id](v4_specification.CropEvent.md#id)
- [source](v4_specification.CropEvent.md#source)

## Properties

### date

• **date**: `Date`

The date the crop event happened (formatted as ISO8061 date: YYYY-MM-DD and YYYY > 2000 and YYYY < 2100).

Dates for liming and burning can be approximate or the first day of the crop year.

**`example`** When the crop event occurred on January 1st of 2000:

```js
"date": "2000-01-01"
```

**`validationrules`** ["cropEventDateIsOnOrAfterContainingCropYear"]

**`format`** date

**`errormessage`**
{
"type": "projectDataError:cropEventDateTypeError",
"validationRules": "projectDataError:cropEventDateValidationRuleViolation"
}

#### Defined in

[v4-specification.ts:1744](https://github.com/nori-dot-eco/nori-dot-com/blob/b53d13d/packages/project/src/v4-specification.ts#L1744)

___

### externalId

• `Optional` **externalId**: `string`

External crop event identifier.

Used to correlate data back to the originating system and to synchronize repeated imports.

**`nullable`**

**`example`**

```js
"externalId": "4dbbddd2-84c5-4f2b-a58f-e1198b531fba"
```

#### Defined in

[v4-specification.ts:1759](https://github.com/nori-dot-eco/nori-dot-com/blob/b53d13d/packages/project/src/v4-specification.ts#L1759)

___

### id

• `Optional` **id**: `string`

Nori's internal crop event identifier.

Used to synchronize repeated imports.

**`nullable`** External systems leave this blank for new projects.

**`example`**

```js
"id": "20e75f5e-05e6-4a4d-92a7-9987de55c586"
```

#### Defined in

[v4-specification.ts:1774](https://github.com/nori-dot-eco/nori-dot-com/blob/b53d13d/packages/project/src/v4-specification.ts#L1774)

___

### source

• `Optional` **source**: `string`

Source of the event

Optional field to indicate what system this data point originated from.

**`nullable`**

**`example`**

```js
"source": "CDL"
```

**`example`**

```js
"source": "FMS name"
```

#### Defined in

[v4-specification.ts:1795](https://github.com/nori-dot-eco/nori-dot-com/blob/b53d13d/packages/project/src/v4-specification.ts#L1795)
