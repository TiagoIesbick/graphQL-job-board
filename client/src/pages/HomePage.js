import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
// import { getJobs } from '../lib/graphql/queries';
// import { useEffect, useState } from 'react';

function HomePage() {
  const {jobs, loading, error } = useJobs();
  // const [jobs, setJobs] = useState([]);
  // useEffect(() =>{
  //   getJobs().then((setJobs));
  // }, []);

  console.log('[HomePage] jobs: ', jobs, loading, error);
  if (loading) {
    return <>Loading...</>
  };
  if (error) {
    return <div className='has-text-danger'>Data unavailable</div>
  };
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
