import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import PaginationBar from '../components/PaginationBar';
// import { getJobs } from '../lib/graphql/queries';
// import { useEffect, useState } from 'react';

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const {jobs, loading, error } = useJobs(JOBS_PER_PAGE, (currentPage -1)*JOBS_PER_PAGE);
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
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      {/* <div>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>{`${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div> */}
      <PaginationBar currentPage={currentPage} totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
