import app from './app';
const port: number = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
