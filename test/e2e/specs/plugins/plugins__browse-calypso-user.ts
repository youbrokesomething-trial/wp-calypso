/**
 * @group calypso-pr
 */

import { DataHelper, TestAccount, PluginsPage, envVariables } from '@automattic/calypso-e2e';
import { Page, Browser } from 'playwright';

declare const browser: Browser;

describe( DataHelper.createSuiteTitle( 'Plugins: Browse' ), function () {
	let page: Page;
	let pluginsPage: PluginsPage;
	let siteUrl: string;

	beforeAll( async () => {
		page = await browser.newPage();
		const testAccount = new TestAccount( 'defaultUser' );
		await testAccount.authenticate( page );
		siteUrl = testAccount.getSiteURL( { protocol: false } );
	} );

	describe( 'Plugins page /plugins', function () {
		it( 'Visit plugins page', async function () {
			pluginsPage = new PluginsPage( page );
			await pluginsPage.visit();
		} );
	} );

	describe( 'Plugins page /plugins/:wpcom-site', function () {
		it( 'Visit plugins page', async function () {
			pluginsPage = new PluginsPage( page );
			await pluginsPage.visit( siteUrl );
		} );

		it.each( [ 'Top paid plugins', 'Editor’s pick', 'Top free plugins' ] )(
			'Plugins page loads %s section',
			async function ( section: string ) {
				await pluginsPage.validateHasSection( section );
			}
		);

		it( 'Can browse all popular plugins', async function () {
			await pluginsPage.clickBrowseAllPopular();
			await pluginsPage.validateSelectedCategory( 'Top free plugins' );
		} );

		it( 'Can return via breadcrumb', async function () {
			if ( envVariables.VIEWPORT_NAME !== 'mobile' ) {
				await pluginsPage.clickPluginsBreadcrumb();
			} else {
				await pluginsPage.clickBackBreadcrumb();
			}
			await pluginsPage.validateHasSection( 'Top paid plugins' );
		} );

		it.each( [
			'WooCommerce',
			'Yoast SEO',
			'MailPoet – emails and newsletters in WordPress',
			'Jetpack CRM – Clients, Invoices, Leads, & Billing for WordPress',
			'Contact Form 7',
			'Site Kit by Google – Analytics, Search Console, AdSense, Speed',
		] )( 'Featured Plugins section should show the %s plugin', async function ( plugin: string ) {
			await pluginsPage.validateHasPluginOnSection( 'featured', plugin );
		} );
	} );
} );
