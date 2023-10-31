# VS Code Che/DS dashboard refresh script

Simple script to refresh the Che/DS dashboard until 401/403 errors occur.

### How to run
1. Set the CHE_URL environment variable to the Che/DS instance url in the `che.env`` file located in this repository.

2. Download dependencies:
```
npm i
```

3. In VS Code, run the `run refresh dashboard` debug config to run the dashboard refresh script, or run the `run refresh editor` debug config to run the editor refresh script (see `.vscode/launch.json`).

4. In the new Chrome window, optionally open the Chrome Developer Tools and open the Network tab.

5. Log into the Che/DS instance with your credentials.

6. Once reaching the dashboard, the script will take either:
* refresh the dashboard continously until a 401/403 error occurs,
* or, create and open an empty workspace and continously refresh the editor until 401/403 error occurs.

When a 401/403 error occurs, code execution will pause at a breakpoint in the `checkFor4xxErrors()` function.
