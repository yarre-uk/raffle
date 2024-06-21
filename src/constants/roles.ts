import { keccak256, stringToBytes } from 'viem';

import { bytes } from '@/types/shared';

export const EXECUTER_ROLE: bytes = keccak256(stringToBytes('EXECUTER_ROLE'));
