"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, RefreshCw } from "lucide-react";
import AdminShell, { adminFetch, Alert, Panel, Table, fieldClass, secondaryButton } from "../_components/AdminShell";
export default function PatientsPage() {
 const router=useRouter(); const [rows,setRows]=useState([]); const [q,setQ]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
 async function load(query=q){setLoading(true);setError("");try{const d=await adminFetch(`/api/admin/patients${query?`?q=${encodeURIComponent(query)}`:""}`);setRows(d.patients||[])}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load("")},[]);
 return <AdminShell title="Patient Records" subtitle={`${rows.length} patient record${rows.length===1?"":"s"} shown. Select a name to view details.`} actions={<button className={secondaryButton} onClick={()=>load()}><RefreshCw size={16}/> Refresh</button>}><Alert error={error}/><Panel title="All Patients" description="Search by patient name or registered phone number."><form className="mb-4 flex flex-col gap-2 sm:flex-row" onSubmit={e=>{e.preventDefault();load()}}><div className="relative flex-1"><Search className="absolute left-3 top-3 text-gray-400" size={17}/><input className={`${fieldClass} pl-10`} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or phone"/></div><button className={secondaryButton}>Search</button></form>{loading?<p className="py-8 text-center">Loading patients…</p>:<Table columns={[{key:"name",label:"Patient name",render:r=><button className="font-extrabold text-[#16587b] underline decoration-[#a9002d] underline-offset-4" onClick={()=>router.push(`/admin/super-admin/patients/${r._id}`)}>{r.name}</button>},{key:"phone",label:"Phone"},{key:"gender",label:"Gender"},{key:"dateOfBirth",label:"Date of birth",render:r=>r.dateOfBirth?new Date(r.dateOfBirth).toLocaleDateString("en-IN"):"—"},{key:"createdAt",label:"Registered",render:r=>new Date(r.createdAt).toLocaleDateString("en-IN") }]} rows={rows} empty="No patients match your search."/>}</Panel></AdminShell>
}
