import express from 'express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from '@build/routes'; // This will be generated by tsoa

const app = express();

app.use(bodyParser.json());

// Register our generated routes
RegisterRoutes(app);

app.listen(3000, () => {
  console.log('Server is running on port 3000.');
});
