# Cursor Learner

Cursor Learner is a prompt generator for cursor users that's focused on learning where you need to improve.

### Example Output

![](/assets/example-prompt-output.png)

### Requirements

1. bun

2. cursor

### Setup

1. `bun install`

2. `bun run retrieve-projects`

   This will copy all of the local user database's associated with every project you've opened in Cursor.

   The files are .vscdb files which are SQLite3 files that VS Code uses internally for workspace storage and extension state

   These files are viewable with any SQLite 3 viewer but the extension in `./vscode/extensions.json` displays the files like so:

![](/assets/vscdb-file-example.png)

3. Specify your projects name, language, tech stack, framework & any dependencies your project has

![](/assets/project-info.png)

4.`bun run generate-prompt`

5. You can now copy the prompt from the `./output-prompts` and feed it into your AI of choice

Here is an example output from OpenAI o3

![](/assets/llm-response.png)

Have fun : )
