import { ApolloClient, InMemoryCache, gql, concat, createHttpLink, ApolloLink } from '@apollo/client';
import { getAccessToken } from '../auth';
// import { GraphQLClient } from 'graphql-request';

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//     headers: () => {
//         const accessToken = getAccessToken();
//         if (accessToken) {
//             return { 'Authorization': 'Bearer ' + accessToken};
//         }
//         return {};
//     },
// });

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql'});

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
    };
    return forward(operation);
});

const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    // if we want to override the default cache-first policy
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: 'network only'
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only'
    //     }
    // }
});

const jobDetailFragment = gql`
    fragment JobDetail on Job {
        id
        date
        title
        company {
            id
            name
        }
        description
    }
`;

const jobByIdQuery = gql`
    query JobByID($id: ID!) {
        job(id: $id) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
`;

export async function createJob({ title, description }) {
    const mutation = gql`
        mutation CreateJob ($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${jobDetailFragment}
    `;
    // const { job } = await client.request(mutation, {
    //     input: { title, description }
    // });
    // return job;
    const { data: { job } } = await apolloClient.mutate({
        mutation,
        variables: { input: { title, description } },
        update: (cache, {data: { job }}) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: job.id },
                data: { job },
            })
        },
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
    // const { company } = await client.request(query, { id });
    // return company;
    const { data: { company } } = await apolloClient.query({
        query,
        variables: { id },
        fetchPolicy: 'network-only',
    });
    return company;
};

export async function getJob(id) {
    // const { job } = await client.request(query, { id });
    // return job;
    const { data: { job } } = await apolloClient.query({
        query: jobByIdQuery,
        variables: { id },
    });
    return job;
};

export async function getJobs() {
    const query = gql`
        query Jobs {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
            }
        }
    `;
    // const { jobs } = await client.request(query);
    // return jobs
    const { data: { jobs } } = await apolloClient.query({
        query,
        // as new jobs can be added to the platform, the fetch policy to this query will update the data as soom as it becomes avalilable, without using the cache, overriding the default cache-first policy for this specific query
        fetchPolicy: 'network-only',
    });
    return jobs;
};
