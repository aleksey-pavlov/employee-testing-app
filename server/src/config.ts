
export default {
    database: {
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: Number(process.env.DATABASE_PORT) || 1521, 
        user: process.env.DATABASE_USER || "empapp",
        pass: process.env.DATABASE_PASS || "qwe123",
        name: process.env.DATABASE_NAME || 'XEPDB1',
    },
    jwtSecret: 'secret'
};  