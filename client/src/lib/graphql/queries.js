import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';

const client = new GraphQLClient('http://localhost:9000/graphql', {
    headers: () => {
        const accesToken = getAccessToken();
        if (accesToken) {
            return { 'Authorization': 'Bearer ' + accesToken};
        }
        return {};
    },
});

export async function createJob({ title, description }) {
    const mutation = gql`
        mutation CreateJob ($input: CreateJobInput!) {
            job: createJob(input: $input) {
                id
            }
        }
    `;
    const { job } = await client.request(mutation, {
        input: { title, description }
    });
    return job;
};

export async function getCompany(id) {
    const query = gql`
        query CompanyByID($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                }
            }
        }
    `;
    const { company } = await client.request(query, { id });
    return company;
};

export async function getJob(id) {
    const query = gql`
        query JobByID($id: ID!) {
            job(id: $id) {
                id
                date
                title
                company {
                    id
                    name
                }
                description
            }
        }
    `;
    const { job } = await client.request(query, { id });
    return job;
};

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                date
                title
                company {
                    name
                }
            }
        }
    `;
    const { jobs } = await client.request(query);
    return jobs
};
