import knex from '../database/connection';
import { Request, Response } from 'express';

class ProcessesController {
    async getJobs(req: Request, res: Response) {

        // const results = await knex({ pro: 'TB_JOB_INFO', de: 'TB_DESENV', pd: 'TB_JOB_INFO_DESENV', pu: 'TB_JOB_USUARIO', us: 'TB_USUARIO' })

        const results = await knex('TB_JOB_INFO')
            .select('TB_JOB_INFO.ID_FLUXO as id',
                'TB_JOB_INFO.nm_fluxo_ui as ui',
                'TB_JOB_INFO.nm_fluxo as name',
                'TB_JOB_INFO.es_ativo as ativo',
                'TB_DESENV.NM_DESENV as devName',
                'TB_USUARIO.NM_USUARIO as usrName',
                'TB_JOB_INFO.TM_EXEC_MANUAL as manual')
            .leftJoin('TB_JOB_INFO_DESENV', 'TB_JOB_INFO.ID_FLUXO', 'TB_JOB_INFO_DESENV.ID_FLUXO')
            .leftJoin('TB_DESENV', 'TB_JOB_INFO_DESENV.CGE_DESENV', 'TB_DESENV.CGE_DESENV')
            .leftJoin('TB_JOB_USUARIO', 'TB_JOB_INFO_DESENV.ID_FLUXO', 'TB_JOB_USUARIO.ID_FLUXO')
            .leftJoin('TB_USUARIO', 'TB_JOB_USUARIO.ID_USUARIO', 'TB_USUARIO.ID_USUARIO');

        return res.json(results);

    }

    async search(req: Request, res: Response) {

        const results = await knex('TB_JOB_INFO')
            .select('TB_JOB_INFO.ID_FLUXO as id',
                'TB_JOB_INFO.nm_fluxo_ui as ui',
                'TB_JOB_INFO.nm_fluxo as name',
                'TB_JOB_INFO.es_ativo as ativo',
                'TB_DESENV.NM_DESENV as devName',
                'TB_USUARIO.NM_USUARIO as usrName',
                'TB_JOB_INFO.TM_EXEC_MANUAL as manual')
            .leftJoin('TB_JOB_INFO_DESENV', 'TB_JOB_INFO.ID_FLUXO', 'TB_JOB_INFO_DESENV.ID_FLUXO')
            .leftJoin('TB_DESENV', 'TB_JOB_INFO_DESENV.CGE_DESENV', 'TB_DESENV.CGE_DESENV')
            .leftJoin('TB_JOB_USUARIO', 'TB_JOB_INFO_DESENV.ID_FLUXO', 'TB_JOB_USUARIO.ID_FLUXO')
            .leftJoin('TB_USUARIO', 'TB_JOB_USUARIO.ID_USUARIO', 'TB_USUARIO.ID_USUARIO')
            .where('nm_fluxo_ui', 'like', `${req.body.ui}`);

        return res.json(results);

    }

    async getJobsException(req: Request, res: Response) {

        // const results = await knex({ pro: 'TB_JOB_INFO', de: 'TB_DESENV', pd: 'TB_JOB_INFO_DESENV', pu: 'TB_JOB_USUARIO', us: 'TB_USUARIO' })

        const results = await knex('TB_JOB_INFO')
            .select()
            .distinct('process')
            .rightJoin('job', 'TB_JOB_INFO.NM_FLUXO_UI', 'job.process')
            .whereNull('NM_FLUXO_UI')
            .orderBy(1);

        return res.json(results);

    }

    async getDevs(req: Request, res: Response) {

        // const results = await knex({ pro: 'TB_JOB_INFO', de: 'TB_DESENV', pd: 'TB_JOB_INFO_DESENV', pu: 'TB_JOB_USUARIO', us: 'TB_USUARIO' })

        const results = await knex('TB_DESENV')
            .select('*')
            .where('ES_ATIVO', '=', 's');

        return res.json(results);

    }

    async getUsers(req: Request, res: Response) {

        // const results = await knex({ pro: 'TB_JOB_INFO', de: 'TB_DESENV', pd: 'TB_JOB_INFO_DESENV', pu: 'TB_JOB_USUARIO', us: 'TB_USUARIO' })

        const results = await knex('TB_USUARIO')
            .select('*');

        return res.json(results);

    }

    async postJob(req: Request, res: Response) {

        try {

            const results = await knex('TB_JOB_INFO')
            .insert({
                NM_FLUXO_UI: req.body.ui,
                NM_FLUXO:  req.body.name,
                ES_Ativo:  req.body.ativo,
                TM_EXEC_MANUAL:  req.body.manual
            });

            return res.json(results);
            
        } catch (error) {

            return res.json(error);
            
        }

    }

    async deleteJob(req: Request, res: Response) {

        let results = await knex('TB_JOB_INFO')
        .where('id_fluxo', req.params.id)
        .del()

        return res.json(results);
    }

}

export default ProcessesController;