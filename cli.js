#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const thisModuleName = 'findIdmlInstance';

function isLinked() {
  try {
        const npmRoot = String(cp.execSync('npm root -g', { encoding: 'utf8' })).trim();
        const p = path.resolve(npmRoot + '/' + thisModuleName);
        const stats = fs.lstatSync(p);
        return stats.isSymbolicLink();
    }
    catch (err) {
        console.error('\n', err.stack, '\n');
    }
}

// when the module is not linked we don't want to show deprecation messages from tedious
if (!isLinked()) {
  process.env.NO_DEPRECATION = 'tedious';
}

const meow = require('meow');
const chalk = require('chalk');
const fii = require('.');

const cli = meow(`
    Usage
      $ fii <guid>
 
    Options
      --env  Which environment to use
      --pdf  Enable to find the *pdf* from a GUID. Specify 'hi' if you want hi-res version, lo-res is default
 
    Examples
      $ fii 1954bb70-4e42-4c18-9246-ed81e9c2fc34 --env=STAGE --pdf[=hi]
      Success!
`, {
    flags: {
        env: {
            type: 'string'
        },
        pdf: {
          type: 'string'
        }
    }
});

// console.log(cli.input[0], cli.flags);

let operation = fii.getIdmlFromGuid;
if (cli.flags.pdf !== undefined)
  operation = fii.getPdfFromGuid
operation(cli.input[0], cli.flags)
	.then(result => {
		console.log(chalk.green('Success!'));
    // console.log(result);
    process.exit();
	})
	.catch(err => {
		console.log(chalk.red('Error'), err);
    process.exit(1);
	});