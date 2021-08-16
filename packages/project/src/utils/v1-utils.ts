import * as moment from 'moment';

import type { V1CropYear, V1Crop, V1Data } from '../index';
import type { ErrorCollector } from '../../../errors';
import type {
  V1FertilizerEvent,
  V1TillageEvent,
} from '../legacy-specifications';

// Max number of data rows for a given year in the spreadsheet
const MAX_SHEET_ROWS_PER_YEAR = 16;

export const sanitizeV1Data = ({
  project,
}: {
  project: V1Data;
}): { sanitizedProject: V1Data } => {
  const sanitizedProject = JSON.parse(JSON.stringify(project)); // https://stackoverflow.com/questions/48885194/typeerror-cannot-assign-to-read-only-property-x-of-object-object-react-j
  project?.projects?.forEach((p, i) =>
    p?.fieldSets?.forEach((f, j) =>
      f?.cropYears?.forEach((cy, k) => {
        sanitizedProject.projects[i].fieldSets[j].cropYears[k] = JSON.parse(
          JSON.stringify(cy, (key, value) => {
            return value?.toLowerCase?.() ?? (value || '');
          })
        ) as V1CropYear;
      })
    )
  );
  return { sanitizedProject };
};

const eventDateIsOutOfRange = (plantingDate: string, eventDate: string) => {
  const daysFromPlantingDate = Math.abs(
    moment(plantingDate).diff(moment(eventDate), 'days')
  );
  return daysFromPlantingDate > 365;
};

/**
 * @example
 * Examine the events for each crop and determine if any of them are beyond the acceptable date range (one year from planting date)
 */
const checkEventDates = (
  crop: V1Crop,
  fieldSetName: string,
  errorCollector: ErrorCollector
) => {
  const filteredCrop = { ...crop };
  filteredCrop.harvestOrKillEvents = [];
  crop.harvestOrKillEvents?.forEach((harvestEvent) => {
    if (eventDateIsOutOfRange(crop.datePlanted, harvestEvent.date)) {
      errorCollector.collectKeyedError(
        'projectDataError:cropEventDateValidationRuleViolation',
        {
          field: fieldSetName,
          crop: crop.cropName,
          eventType: 'harvestEvent',
          eventDate: harvestEvent.date,
          datePlanted: crop.datePlanted,
        }
      );
    } else {
      filteredCrop.harvestOrKillEvents.push(harvestEvent);
    }
  });
  filteredCrop.tillageEvents = [];
  crop.tillageEvents?.forEach((tillageEvent) => {
    if (eventDateIsOutOfRange(crop.datePlanted, tillageEvent.date)) {
      errorCollector.collectKeyedError(
        'projectDataError:cropEventDateValidationRuleViolation',
        {
          field: fieldSetName,
          crop: crop.cropName,
          eventType: 'tillageEvent',
          eventDate: tillageEvent.date,
          datePlanted: crop.datePlanted,
        }
      );
    } else {
      filteredCrop.tillageEvents.push(tillageEvent);
    }
  });
  filteredCrop.limingEvents = [];
  crop.limingEvents?.forEach((limingEvent) => {
    if (eventDateIsOutOfRange(crop.datePlanted, limingEvent.date)) {
      errorCollector.collectKeyedError(
        'projectDataError:cropEventDateValidationRuleViolation',
        {
          field: fieldSetName,
          crop: crop.cropName,
          eventType: 'limingEvent',
          eventDate: limingEvent.date,
          datePlanted: crop.datePlanted,
        }
      );
    } else {
      filteredCrop.limingEvents.push(limingEvent);
    }
  });
  filteredCrop.organicMatterEvents = [];
  crop.organicMatterEvents?.forEach((organicMatterEvent) => {
    if (eventDateIsOutOfRange(crop.datePlanted, organicMatterEvent.date)) {
      errorCollector.collectKeyedError(
        'projectDataError:cropEventDateValidationRuleViolation',
        {
          field: fieldSetName,
          crop: crop.cropName,
          eventType: 'organicMatterEvent',
          eventDate: organicMatterEvent.date,
          datePlanted: crop.datePlanted,
        }
      );
    } else {
      filteredCrop.organicMatterEvents.push(organicMatterEvent);
    }
  });
  filteredCrop.fertilizerEvents = [];
  crop.fertilizerEvents?.forEach((fertilizerEvent) => {
    if (eventDateIsOutOfRange(crop.datePlanted, fertilizerEvent.date)) {
      errorCollector.collectKeyedError(
        'projectDataError:cropEventDateValidationRuleViolation',
        {
          field: fieldSetName,
          crop: crop.cropName,
          eventType: 'fertilizerEvent',
          eventDate: fertilizerEvent.date,
          datePlanted: crop.datePlanted,
        }
      );
    } else {
      filteredCrop.fertilizerEvents.push(fertilizerEvent);
    }
  });
  filteredCrop.irrigationEvents = [];
  crop.irrigationEvents?.forEach((irrigationEvent) => {
    if (
      eventDateIsOutOfRange(
        crop.datePlanted,
        irrigationEvent.endDate ?? irrigationEvent.date
      )
    ) {
      errorCollector.collectKeyedError(
        'projectDataError:cropEventDateValidationRuleViolation',
        {
          field: fieldSetName,
          crop: crop.cropName,
          eventType: 'irrigationEvent',
          eventDate: irrigationEvent.date,
          datePlanted: crop.datePlanted,
        }
      );
    } else {
      filteredCrop.irrigationEvents.push(irrigationEvent);
    }
  });
  return filteredCrop;
};

// eslint-disable-next-line jsdoc/require-example
/**
 * The very first crop year on a field is subject to a problem where any fertilizer or tillage events
 * that occur in the calendar year PRIOR to the crop year (like fall fertilizer) will cause the import
 * code to throw because there doesn't yet exist a crop year to assign the event to.
 * We therefore notify the user of the problematic event and remove it from the import.
 *
 * @param crop The crop for which we are detecting edge-case date problems.
 * @param fieldName The name of the field in which this error was encountered.
 * @param earliestCropYear The year of the earliest crop year that appears on this field.
 * @param errorCollector The error collector collecting all errors for this import.
 *
 * @returns The V1Crop with offending events removed.
 */
const checkFertilizerTillageDateEdgeCase = (
  crop: V1Crop,
  fieldName: string,
  earliestCropYear: number,
  errorCollector: ErrorCollector
): V1Crop => {
  const filteredCrop = { ...crop };
  const filteredFertilizerEvents: V1FertilizerEvent[] = [];
  const filteredTillageEvents: V1TillageEvent[] = [];
  crop.fertilizerEvents.forEach((fertilizerEvent) => {
    const fertilizerEventYear = Number(
      fertilizerEvent.date.split('/').slice(-1)
    );
    if (fertilizerEventYear < earliestCropYear) {
      errorCollector.collectKeyedError(
        'projectDataError:priorYearEdgeCaseError',
        {
          field: fieldName,
          event: fertilizerEvent,
        }
      );
    } else {
      filteredFertilizerEvents.push(fertilizerEvent);
    }
  });
  crop.tillageEvents.forEach((tillageEvent) => {
    const tillageEventYear = Number(tillageEvent.date.split('/').slice(-1));
    if (tillageEventYear < earliestCropYear) {
      errorCollector.collectKeyedError(
        'projectDataError:priorYearEdgeCaseError',
        {
          field: fieldName,
          event: tillageEvent,
        }
      );
    } else {
      filteredTillageEvents.push(tillageEvent);
    }
  });
  filteredCrop.fertilizerEvents = filteredFertilizerEvents;
  filteredCrop.tillageEvents = filteredTillageEvents;
  return filteredCrop;
};
export const collectV1Errors = (
  sanitizedProject: V1Data,
  errorCollector: ErrorCollector
) => {
  const filteredProject = { ...sanitizedProject };
  sanitizedProject?.projects?.forEach((project, i) => {
    project?.fieldSets?.forEach((field, j) => {
      const earliestCropYear = field?.cropYears?.[0];
      earliestCropYear?.crops?.forEach((crop, l) => {
        filteredProject.projects[i].fieldSets[j].cropYears[0].crops[l] =
          checkFertilizerTillageDateEdgeCase(
            crop,
            field.fieldSetName,
            earliestCropYear.cropYear,
            errorCollector
          );
      });
      field?.cropYears?.forEach((cropYear, k) => {
        // Irrigation rows
        const reducer = (acc: number, crop: V1Crop): number => {
          if (crop?.irrigationEvents?.length > 0) {
            acc += crop.irrigationEvents.length;
          }
          return acc;
        };
        const totalRequiredIrrigationRows = cropYear?.crops?.reduce(reducer, 0);
        if (totalRequiredIrrigationRows > MAX_SHEET_ROWS_PER_YEAR) {
          errorCollector.collectKeyedError(
            'projectDataError:irrigationEventOverflowError',
            {
              cropYear: cropYear.cropYear,
              numberOfIrrigationEntries: totalRequiredIrrigationRows,
            }
          );
          cropYear?.crops?.forEach((crop, l) => {
            filteredProject.projects[i].fieldSets[j].cropYears[k].crops[
              l
            ].irrigationEvents = [];
          });
        }
        // Event dates
        cropYear?.crops?.forEach((crop, l) => {
          const filteredCrop = checkEventDates(
            crop,
            field.fieldSetName,
            errorCollector
          );
          filteredProject.projects[i].fieldSets[j].cropYears[k].crops[l] =
            filteredCrop;
        });
      });
    });
  });
  return filteredProject;
};
