import database from '@/shared/database/index.cjs';
export function getNativePool(){return database.getPool();}
export async function nativeQuery(sql,params=[]){return {rows:await database.query(sql,params)};}
export default {getNativePool,nativeQuery};
