export async function request(url,options={}) {
 const token=typeof window!=='undefined'?(localStorage.getItem('token')||localStorage.getItem('jwt')):null;
 const response=await fetch(url,{...options,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...options.headers}});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Request failed ('+response.status+').');return result;
}
