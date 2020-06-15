import express from 'express';
import ProcessesController from './controllers/ProcessesController';

const routes = express.Router();
const processesController = new ProcessesController();

routes.get('/jobs', processesController.getJobs);
routes.get('/jobsException', processesController.getJobsException);
routes.get('/devs', processesController.getDevs);
routes.get('/users', processesController.getUsers);

routes.post('/search', function (req, res) {

    processesController.search(req, res);

});

routes.post('/postJob', function (req, res) {

    processesController.postJob(req, res);

});

routes.delete('/deleteJob/:id', function (req, res) {

    console.log(req.params.id);

    processesController.deleteJob(req, res);

});

export default routes;

//Service Pattern
//Repository Pattern