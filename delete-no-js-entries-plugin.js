'use strict';


class DeleteNoJsEntriesPlugin {

	constructor(options) {
		// list entries with no js files
		this.entriesWithNoJs = [];
	}

	// define the `apply` method
	apply(compiler) {

		// specify the event hook to attach to
		compiler.hooks.emit.tapAsync('DeleteNoJsEntriesPlugin', (compilation, callback) => {

			// prepare list of no js entry
			compilation.chunks.forEach((chunk) => {
				
				if (chunk.entryModule) {

					const entryNoJs = chunk.entryModule.dependencies.every((dep, index) => {
						return /\.js$/.test(dep.request) === false;
					});

					if (entryNoJs) {
						this.entriesWithNoJs.push(chunk.name);
					}
					
				}

			});

			// follow code get from symfony/webpack-encore package,
			// see: https://github.com/symfony/webpack-encore/blob/master/lib/webpack/delete-unused-entries-js-plugin.js

			// loop over output chunks
			compilation.chunks.forEach((chunk) => {
				// if current chunk is from no js entry
				if (this.entriesWithNoJs.includes(chunk.name)) {

					let fileDeleteCount = 0;

					// loop over the output files and find one *.js
					chunk.files.forEach((filename) => {
						if (/\.js(\.map)?(\?[^.]*)?$/.test(filename)) {
							fileDeleteCount++;
							// remove the output file
							delete compilation.assets[filename];
							// also remove file from manifest
							chunk.files.splice(chunk.files.indexOf(filename), 1);
						}
					});

					// sanity check: make sure 1 or 2 files were deleted
					// if there's some edge case where more .js files
					// or 0 .js files might be deleted, I'd rather error
					if (fileDeleteCount === 0 || fileDeleteCount > 2) {
						throw new Error(`Problem deleting JS entry for ${chunk.name}: ${fileDeleteCount} files were deleted`);
					}
				}
			});

			callback();
		});

	}
}


module.exports = DeleteNoJsEntriesPlugin;
