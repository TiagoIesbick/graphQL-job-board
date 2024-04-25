import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateJob } from '../lib/graphql/hooks';
// import { createJobMutation, jobByIdQuery } from '../lib/graphql/queries';
//import { useMutation } from '@apollo/client';
//import { createJob } from '../lib/graphql/queries';

function CreateJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createJob, loading, error } = useCreateJob();
  // const [mutate, { loading, error }] = useMutation(createJobMutation);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const job = await createJob(title, description);
    //const job = await createJob({ title, description });
    /*
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
    */
    console.log('job created:', job);
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" disabled={loading}
              onClick={handleSubmit}>
                Submit
              </button>
              {error ? <div className="has-text-danger">{error.message}</div>: null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
