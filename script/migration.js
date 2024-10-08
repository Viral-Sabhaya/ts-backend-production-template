const { exec } = require('child_process');

// Command Line Arguments
const command = process.argv[2];
const migrationName = process.argv[3];

// Valid Migration Commands
const validCommands = ['create', 'up', 'down', 'list', 'prune'];
if (!validCommands.includes(command)) {
  console.error(`Invalid command: Command must be one of ${validCommands}`);
  process.exit(0);
}
const commandsWithoutMigrationNameRequired = ['list', 'prune'];
// Validate Command
if (!validCommands.includes(command)) {
  console.error(`Invalid command: Command must be one of ${validCommands.join(', ')}`);
  process.exit(1);
}

// Check if Migration Name is Required
if (!commandsWithoutMigrationNameRequired.includes(command) && !migrationName) {
  console.error('Migration name is required');
  process.exit(1);
}

// Function to Run NPM Script
function runNpmScript() {
  return new Promise((resolve, reject) => {
    let execCommand = '';

    // Construct the command based on the type
    if (commandsWithoutMigrationNameRequired.includes(command)) {
      execCommand = `migrate ${command}`;
    } else {
      execCommand = `migrate ${command} ${migrationName}`;
    }

    // Execute the command
    const childProcess = exec(execCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error running script: ${stderr || error.message}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Execute the NPM Script
runNpmScript()
  .then((output) => console.log(`Success: ${output}`))
  .catch((error) => console.error(`Failed: ${error}`));
