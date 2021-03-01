import "reflect-metadata";
import {createConnection} from "typeorm";
import app from './apps';

createConnection().then(async connection => {
    console.log("DB connected !");
}).catch(error => console.log(error));

// run express application on port 4000 : http://localhost:4000
app.listen(app.get('port'), () =>
    console.log(`App Listening on PORT ${app.get('port')}`),
);