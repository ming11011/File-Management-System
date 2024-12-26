module.exports = {
	HOST: "localhost",
	USER: "root",
	PASSWORD: "passwd",
	DB: "file_management",
	dialect: "mysql",
	timezone: "+08:00",
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
};
