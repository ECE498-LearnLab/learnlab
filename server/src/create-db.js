var pgtools = require('pgtools');
var args = process.argv.slice(2);

const config = {
    user: args[0],
    host: 'localhost',
    password: args[1],
    port: 5432
};

pgtools.createdb(config, 'learnlab_local', function (err, res) {
    if (err) {
        console.error(err);
        process.exit(-1);
    }
    console.log(res);
});
