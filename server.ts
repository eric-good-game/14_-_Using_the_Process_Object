import app from "./src/app";
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

const port = argv['port'] || 8080;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on("error", (error) => console.log(`Server error: ${error}`));