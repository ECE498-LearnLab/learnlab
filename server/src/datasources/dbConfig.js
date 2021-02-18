const useLocalDb = true;
const connectionConfig = useLocalDb
    ? {        
        host: 'db',
        user: 'postgres',
        port: 5432,
        password: 'postgres',
        database: 'learnlab_local'
    }
    : {
        host: 'learnlab-database-1.csosestc6lcm.ca-central-1.rds.amazonaws.com',
        user: 'root',
        password: '<PWD>',
        database: 'learnlab_1'
};

module.exports = {
    client: 'pg',
    connection: connectionConfig
};