#!/usr/bin/env node
'use strict';

const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const pkg = require('./package.json');

function isLinked() {
  try {
        const npmRoot = String(cp.execSync('npm root -g', { encoding: 'utf8' })).trim();
        const p = path.resolve(npmRoot + '/' + pkg.name);
        const stats = fs.lstatSync(p);
        return stats.isSymbolicLink();
    }
    catch (err) {
        // console.error('\n', err.stack, '\n');
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

if (!cli.input[0]) {
  console.log(chalk.red('No arguments. You need to supply a GUID.'));
  process.exit(1);
}

let operation = fii.getIdmlFromGuid;
if (cli.flags.pdf !== undefined)
  operation = fii.getPdfFromGuid
operation(cli.input[0], cli.flags)
	.then(result => {
    const expl = require('child_process').exec(`explorer.exe /select,${result}`);
    expl.stderr.on('data', (data) => {
      console.log(chalk.red('Something went wrong opening the folder'), data.toString());
      process.exit(1);
    });
    expl.on('exit', code => {
      console.log(chalk.green('Success!'));
      process.exit();
    });
	})
	.catch(err => {
		console.log(chalk.red('Error'), err.message ? err.message : err);
    process.exit(1);
	});