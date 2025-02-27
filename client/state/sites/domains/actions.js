import debugFactory from 'debug';
import { translate } from 'i18n-calypso';
import { map } from 'lodash';
import wpcom from 'calypso/lib/wp';
import {
	DOMAIN_PRIVACY_ENABLE,
	DOMAIN_PRIVACY_DISABLE,
	SITE_DOMAINS_RECEIVE,
	SITE_DOMAINS_REQUEST,
	SITE_DOMAINS_REQUEST_SUCCESS,
	SITE_DOMAINS_REQUEST_FAILURE,
	DOMAIN_CONTACT_INFO_DISCLOSE,
	DOMAIN_CONTACT_INFO_REDACT,
} from 'calypso/state/action-types';
import { requestSite } from 'calypso/state/sites/actions';
import { createSiteDomainObject } from './assembler';

import 'calypso/state/data-layer/wpcom/domains/privacy/index.js';

/**
 * Module vars
 */
const debug = debugFactory( 'calypso:state:sites:domains:actions' );
const noop = () => {};

/**
 * Action creator function
 *
 * Returns an action object to be used in signalling that
 * an object containing the domains for
 * a given site have been received.
 *
 * @param {number} siteId - identifier of the site
 * @param {object} domains - domains array gotten from WP REST-API response
 * @returns {object} the action object
 */
export const domainsReceiveAction = ( siteId, domains ) => {
	const action = {
		type: SITE_DOMAINS_RECEIVE,
		siteId,
		domains: map( domains, createSiteDomainObject ),
	};

	debug( 'returning action: %o', action );
	return action;
};

/**
 * Action creator function
 *
 * Return SITE_DOMAINS_REQUEST action object
 *
 * @param {number} siteId - side identifier
 * @returns {object} siteId - action object
 */
export const domainsRequestAction = ( siteId ) => {
	const action = {
		type: SITE_DOMAINS_REQUEST,
		siteId,
	};

	debug( 'returning action: %o', action );
	return action;
};

/**
 * Action creator function
 *
 * Return SITE_DOMAINS_REQUEST_SUCCESS action object
 *
 * @param {number} siteId - side identifier
 * @returns {object} siteId - action object
 */
export const domainsRequestSuccessAction = ( siteId ) => {
	const action = {
		type: SITE_DOMAINS_REQUEST_SUCCESS,
		siteId,
	};

	debug( 'returning action: %o', action );
	return action;
};

/**
 * Action creator function
 *
 * Return SITE_DOMAINS_REQUEST_FAILURE action object
 *
 * @param {number} siteId - site identifier
 * @param {object} error - error message according to REST-API error response
 * @returns {object} action object
 */
export const domainsRequestFailureAction = ( siteId, error ) => {
	const action = {
		type: SITE_DOMAINS_REQUEST_FAILURE,
		siteId,
		error,
	};

	debug( 'returning action: %o', action );
	return action;
};

/**
 * Fetches domains for the given site.
 *
 * @param {number} siteId - identifier of the site
 * @returns {Function} a promise that will resolve once fetching is completed
 */
export function fetchSiteDomains( siteId ) {
	return ( dispatch ) => {
		dispatch( domainsRequestAction( siteId ) );

		return wpcom.req
			.get( `/sites/${ siteId }/domains`, { apiVersion: '1.2' } )
			.then( ( data ) => {
				const { domains = [], error, message } = data;

				if ( error ) {
					throw new Error( message );
				}

				dispatch( domainsRequestSuccessAction( siteId ) );
				dispatch( domainsReceiveAction( siteId, domains ) );
			} )
			.catch( ( error ) => {
				const message =
					error instanceof Error
						? error.message
						: translate(
								'There was a problem fetching site domains. Please try again later or contact support.'
						  );

				dispatch( domainsRequestFailureAction( siteId, message ) );
			} );
	};
}

export function enableDomainPrivacy( siteId, domain ) {
	return {
		type: DOMAIN_PRIVACY_ENABLE,
		siteId,
		domain,
	};
}

export function disableDomainPrivacy( siteId, domain ) {
	return {
		type: DOMAIN_PRIVACY_DISABLE,
		siteId,
		domain,
	};
}

/**
 * @callback onComplete
 * @param {any} error
 * @param {any} data
 * @returns {void}
 */

/**
 * @param {number} siteId
 * @param {string} domain
 * @param {onComplete} onComplete
 */
export const setPrimaryDomain =
	( siteId, domain, onComplete = noop ) =>
	( dispatch ) => {
		debug( 'setPrimaryDomain', siteId, domain );
		return wpcom.req.post( `/sites/${ siteId }/domains/primary`, { domain }, ( error, data ) => {
			if ( error ) {
				return onComplete( error, data );
			}

			return dispatch( fetchSiteDomains( siteId ) ).then( () => {
				onComplete( null, data );
				dispatch( requestSite( siteId ) );
			} );
		} );
	};

export function discloseDomainContactInfo( siteId, domain ) {
	return {
		type: DOMAIN_CONTACT_INFO_DISCLOSE,
		siteId,
		domain,
	};
}

export function redactDomainContactInfo( siteId, domain ) {
	return {
		type: DOMAIN_CONTACT_INFO_REDACT,
		siteId,
		domain,
	};
}
