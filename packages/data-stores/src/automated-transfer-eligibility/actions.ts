import { TransferEligibility } from './types';

export const receiveTransferEligibility = (
	transferEligibility: TransferEligibility,
	siteId: number
) => ( {
	type: 'TRANSFER_ELIGIBILITY_RECEIVE' as const,
	transferEligibility,
	siteId,
} );

export const requestTransferEligibility = () => ( {
	type: 'TRANSFER_ELIGIBILITY_REQUEST' as const,
} );

export type Action =
	| ReturnType< typeof receiveTransferEligibility | typeof requestTransferEligibility >
	// Type added so we can dispatch actions in tests, but has no runtime cost
	| { type: 'TEST_ACTION' };
