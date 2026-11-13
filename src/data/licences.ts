import { LicenceRecord } from '../types/licence';
import { LICENCES_PART_1 } from './licencesPart1';
import { LICENCES_PART_2A } from './licencesPart2a';
import { LICENCES_PART_2B } from './licencesPart2b';
import { LICENCES_PART_3A } from './licencesPart3a';
import { LICENCES_PART_3B } from './licencesPart3b';

export const LICENCES: LicenceRecord[] = [
  ...LICENCES_PART_1,
  ...LICENCES_PART_2A,
  ...LICENCES_PART_2B,
  ...LICENCES_PART_3A,
  ...LICENCES_PART_3B,
].sort((a, b) => a.serialNo - b.serialNo);
