#!/usr/bin/env node
'use strict';
const meow = require('meow');
const chalk = require('chalk');
const fii = require('.');
 
const cli = meow(`
    Usage
      $ fii <guid>
 
    Options
      --env  Which environment to use
 
    Examples
      $ fii 1954bb70-4e42-4c18-9246-ed81e9c2fc34 --env=STAGE
      Success!
`, {
    flags: {
        env: {
            type: 'string'
        }
    }
});

// console.log(cli.input[0], cli.flags);
fii(cli.input[0], cli.flags)
	.then(result => {
		console.log(chalk.green('Success!'));
	})
	.catch(err => {
		console.log(chalk.red('Error'), err);
	});