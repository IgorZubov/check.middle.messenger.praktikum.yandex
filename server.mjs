import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('./dist'));

app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
  
    res.status(200);
  });
  
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
