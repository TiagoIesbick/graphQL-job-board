import { useMutation, useQuery } from "@apollo/client";
import { companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery } from "./queries";

export function useCompany(id) {
    const {data , loading, error} = useQuery(companyByIdQuery, {
        variables: { id },
        fetchPolicy: 'network-only'
    });
    return {company: data?.company, loading, error: Boolean(error)}; // the '?' is to consider that company will be null in the first render as the data isn't fetched yet
};

export function useJob(id) {
    const {data , loading, error} = useQuery(jobByIdQuery, { variables: { id } });
    return {job: data?.job, loading, error: Boolean(error)};
};

export function useJobs(limit, offset) {
    const {data , loading, error} = useQuery(jobsQuery, {
        variables: { limit, offset },
        fetchPolicy: 'network-only'
        });
    return {jobs: data?.jobs, loading, error: Boolean(error)};
};

export function useCreateJob() {
    const [mutate, { loading, error }] = useMutation(createJobMutation);

    const createJob = async (title, description) => {
        const { data: { job } } = await mutate({
            variables: { input: { title, description } },
            update: (cache, { data: { job } }) => {
                cache.writeQuery({
                    query: jobByIdQuery,
                    variables: { id: job.id },
                    data: { job },
                })
            },
        });
        return job
    };

    return {
        createJob,
        loading,
        error
    }
};
