const useLocalDb = false;
const connectionConfig = useLocalDb
    ? {        
        host: 'db',
        user: 'postgres',
        port: 5432,
        password: 'postgres',
        database: 'learnlab_local'
    }
    : {
        host: 'learnlab-1.csosestc6lcm.ca-central-1.rds.amazonaws.com',
        user: 'postgres',
        password: 'postgres',
        database: 'learnlab'
};

module.exports = {
    client: 'pg',
    connection: connectionConfig
};