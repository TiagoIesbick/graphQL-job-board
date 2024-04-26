import { connection } from './connection.js';
import DataLoader from 'dataloader';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

/* this aproach cache the companies forever, so the updates will never be visibles to users
to change this we will put the dataloader in the context, so the cache will be use by request
export const companyLoader = new DataLoader(async (ids) => {
  console.log('[companyLoader] ids: ', ids);
  const companies = await getCompanyTable().select().whereIn('id', ids);
  return ids.map((id) => companies.find((company) => company.id === id));
});
*/

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    console.log('[companyLoader] ids: ', ids);
    const companies = await getCompanyTable().select().whereIn('id', ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
};
