import express, { Express, json } from 'express';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { Config } from '../interfaces';

function getFiles(dirPath: string, array: string[], relative: string) {
    array = array || [];
    if (!relative) return array;
    let files = readdirSync(dirPath);
    files.forEach((file) => {
        if (statSync(dirPath + '/' + file).isDirectory()) array = getFiles(dirPath + '/' + file, array, relative);
        else array.push(path.join('./', dirPath, '/', file).split(relative).pop());
    });
    return array;
}

export default class Client {
    public config: Config;
    public app: Express;

    public async init() {
        this.config = {
            port: process.env.PREFIX || (5000).toString(),
            database: process.env.DATABASE,
        } as Config;

        this.app = express();
        // connect(this.config.database, {
        //     useUnifiedTopology: true,
        //     useFindAndModify: true,
        //     useNewUrlParser: true,
        // } as ConnectOptions);

        this.app.use(json());

        this.app.get('/', (req, res) => {
            this.app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'website', 'build')));
            if (this.config.production) res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'website', 'build', 'index.html'));
            else res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'development', 'index.html'));
        });

        getFiles(path.join(__dirname, '..', 'routes'), [], '/routes').forEach((file, index, array) => {
            try {
                let fileWithoutDot = file.split('.').shift();
                const { route } = require('../routes' + file);

                let router = this.app.route(`/api${fileWithoutDot}`);
                if (route.get) {
                    if (route.auth) router.get(route.auth, route.get);
                    else router.get(route.get);
                }
                if (route.post) {
                    if (route.auth) router.post(route.auth, route.post);
                    else router.post(route.post);
                }
                if (route.put) {
                    if (route.auth) router.put(route.auth, route.put);
                    else router.put(route.put);
                }
                if (route.delete) {
                    if (route.auth) router.delete(route.auth, route.delete);
                    else router.delete(route.delete);
                }
            } catch (err) {
                console.error(err);
            }
        });

        this.app.listen(this.config.port, () => {
            console.log(`Listening on port ${this.config.port}`);
        });
    }
}
