"use client";
export default function DateRangeFilter({ from, to, setFrom, setTo, onApply, onClear }) {
 return <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-[#dceaf1] bg-[#f7fafc] p-3">
  <label className="text-xs font-bold text-[#254a5d]">From date<input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="mt-1 block rounded-md border border-[#cbdce5] bg-white px-3 py-2 text-sm"/></label>
  <label className="text-xs font-bold text-[#254a5d]">To date<input type="date" value={to} min={from||undefined} onChange={e=>setTo(e.target.value)} className="mt-1 block rounded-md border border-[#cbdce5] bg-white px-3 py-2 text-sm"/></label>
  <button type="button" onClick={onApply} className="rounded-md bg-[#16587b] px-4 py-2 text-sm font-bold text-white">Apply filter</button>
  <button type="button" onClick={onClear} className="rounded-md border border-[#16587b] px-4 py-2 text-sm font-bold text-[#16587b]">Clear</button>
 </div>;
}
