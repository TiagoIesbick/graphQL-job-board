import { GraphQLError } from 'graphql';
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from './db/jobs.js';
import { getCompany } from './db/companies.js';
// import { companyLoader } from './db/companies.js';

export const resolvers = {
    Query: {
        company: async (_root, {id}) => {
            const company = await getCompany(id);
            if(!company) {
                throw notFoundError(`No company found for ${id}`);
            };
            return company;
        },
        job: async (_root, {id}) => {
            const job = await getJob(id);
            if(!job) {
                throw notFoundError('No job found for ' + id);
            };
            return job;
        },
        jobs: () => getJobs(),
    },

    Mutation: {
        createJob: (_root, { input: { title, description } }, {user}) => {
            if (!user) {
                throw unauthorizedError('Missing authentication');
            }
            return createJob({companyId: user.companyId, title, description});
        },

        deleteJob: async (_root, {id}, {user}) => {
            if (!user) {
                throw unauthorizedError('Missing authentication');
            };
            const job = await deleteJob(id, user.companyId);
            if (!job) {
                throw notFoundError('No job found for ' + id);
            };
            return job;
        },

        updateJob: async (_root, {input: { id, title, description } }, {user}) => {
            if (!user) {
                throw unauthorizedError('Missing authentication');
            };
            const job = await updateJob({id, title, description, companyId: user.companyId});
            if (!job) {
                throw notFoundError('No job found for ' + id);
            };
            return job;
        },
    },

    Job: {
        // company: (job) => getCompany(job.companyId), // before dataloader
        // company: (job) => companyLoader.load(job.companyId) // after dataloader, before dataloader be added to context
        company: (job, _args, { companyLoader } ) => companyLoader.load(job.companyId),
        date: (job) => toIsoDate(job.createdAt),
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    }
};

function notFoundError(message) {
    return new GraphQLError( message, {
        extensions: { code: 'NOT_FOUND' },
    });
};

function unauthorizedError(message) {
    return new GraphQLError( message, {
        extensions: { code: 'UNAUTHORIZED' },
    });
};

function toIsoDate(date) {
    return date.slice(0, 'yyyy-mm-dd'.length);
};
