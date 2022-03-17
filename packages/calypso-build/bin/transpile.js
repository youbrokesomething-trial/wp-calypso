#!/usr/bin/env node

// find all the packages
const { execSync } = require( 'child_process' );
const path = require( 'path' );

const dir = process.cwd();
const root = path.dirname( __dirname );
const babelPresetFile = require.resolve( '@automattic/calypso-babel-config/presets/default.js' );

const inputDir = path.join( dir, 'src' );
const outputDirESM = path.join( dir, 'dist', 'esm' );
const outputDirCJS = path.join( dir, 'dist', 'cjs' );

let transpileAll = true;
let transpileESM = false;
let transpileCJS = false;

for ( const arg of process.argv.slice( 2 ) ) {
	if ( arg === '--esm' ) {
		transpileAll = false;
		transpileESM = true;
	}

	if ( arg === '--cjs' ) {
		transpileAll = false;
		transpileCJS = true;
	}
}

// If the pattern was just a relative path (**/test/**), Babel would resolve it against the
// root directory (set as cwd) which isn't an ancestor of any of the source files.
const testIgnorePattern = path.join( dir, '**/test/**' );

// Try a couple of levels up as well to get it working in a monorepo where deps are hoisted.
const possibleRoots = [ root, path.dirname( root ), path.dirname( path.dirname( root ) ) ];
let thisRootActuallyWorks = root;
for ( const testRoot of possibleRoots ) {
	thisRootActuallyWorks = testRoot;
	try {
		// The -f flag essentially gets babel to exit with a 0 exit code. Otherwise,
		// it fails because the required arguments don't exist. This makes it easier
		// to test that the binary at least exists.
		execSync( 'npx --no-install babel -f this-is-fake-and-doesnt-exist', {
			cwd: testRoot,
			encoding: 'utf8',
			stdio: 'pipe', // Stops it from printing "not found" to the console.
		} );
	} catch ( e ) {
		if ( e.stderr?.includes( 'not found: babel' ) ) {
			continue; // Try the next possible root.
		}
	}
	// If we made it here, it appears that the babel command at least exits.
	break;
}

const baseCommand = `npx --no-install babel --presets="${ babelPresetFile }" --ignore "${ testIgnorePattern }" --extensions='.js,.jsx,.ts,.tsx'`;

console.log( 'Building %s', dir );

if ( transpileAll || transpileESM ) {
	execSync( `${ baseCommand } -d "${ outputDirESM }" "${ inputDir }"`, {
		cwd: thisRootActuallyWorks,
	} );
}

if ( transpileAll || transpileCJS ) {
	execSync( `${ baseCommand } -d "${ outputDirCJS }" "${ inputDir }"`, {
		env: Object.assign( {}, process.env, { MODULES: 'commonjs' } ),
		cwd: thisRootActuallyWorks,
	} );
}
