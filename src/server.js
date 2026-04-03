const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception 🤷‍♂️ Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
