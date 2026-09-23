"use client";
import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

type Settings = { bank: Record<string,string>; stripe: Record<string,string|boolean>; s3: Record<string,string|boolean>; smtp: Record<string,string|boolean>; notifications: Record<string,boolean> };
const fields = {
  bank: [["accountName","Account holder"],["bankName","Bank name"],["accountNumber","Account number"],["routingNumber","Routing or sort code"],["iban","IBAN"],["swiftCode","SWIFT / BIC"],["instructions","Payment instructions"]],
  stripe: [["publishableKey","Publishable key"],["secretKey","Secret key"],["webhookSecret","Webhook signing secret"]],
  s3: [["endpoint","Endpoint"],["region","Region"],["bucket","Bucket"],["accessKeyId","Access key ID"],["secretAccessKey","Secret access key"],["publicBaseUrl","Public file URL"]],
  smtp: [["host","SMTP host"],["port","SMTP port"],["mainEmail","Main email address — contact and form messages"],["password","Main email password"],["fromName","Sender name"],["noReplyEmail","No-reply email address — OTP emails"],["noReplyPassword","No-reply email password"]],
} as const;
const secret = new Set(["secretKey","webhookSecret","secretAccessKey","password","noReplyPassword"]);

export function CredentialsManager() {
  const [data,setData]=useState<Settings|null>(null); const [saving,setSaving]=useState(false); const [message,setMessage]=useState("");
  useEffect(()=>{apiFetch<{settings:Settings}>("/api/admin/settings").then(x=>setData(x.settings)).catch(e=>setMessage(e.message));},[]);
  if(!data) return <p className="flex items-center gap-2 text-text-mid"><LoaderCircle className="animate-spin" size={18}/>Loading configuration…</p>;
  const update=(group:keyof Settings,key:string,value:string|boolean)=>setData({...data,[group]:{...data[group],[key]:value}});
  async function save(){setSaving(true);setMessage("");try{await apiFetch("/api/admin/settings",{method:"PUT",body:JSON.stringify(data)});setMessage("Settings saved to the database.");}catch(e){setMessage(e instanceof Error?e.message:"Settings could not be saved.");}finally{setSaving(false)}}
  return <div className="space-y-6">
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>Stripe payments are disabled.</b> Customers will see the bank transfer instructions below.</div>
    {(Object.keys(fields) as Array<keyof typeof fields>).map(group=><section key={group} className="rounded-2xl border border-border bg-white p-6 shadow-sm"><h2 className="text-lg font-extrabold capitalize text-text-dark">{group === "s3" ? "Cloud S3 storage" : group === "smtp" ? "Email accounts and delivery" : `${group} settings`}</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{fields[group].map(([key,label])=><label key={key} className={key==="instructions"?"md:col-span-2":""}><span className="mb-1.5 block text-sm font-semibold text-text-dark">{label}</span>{key==="instructions"?<textarea className="min-h-24 w-full rounded-lg border border-border p-3" value={String(data[group][key]??"")} onChange={e=>update(group,key,e.target.value)}/>:<input type={secret.has(key)?"password":"text"} placeholder={secret.has(key)&&Boolean(data[group][`${key}Configured`])?"Configured — leave blank to keep current value":""} className="h-11 w-full rounded-lg border border-border px-3" value={String(data[group][key]??"")} onChange={e=>update(group,key,e.target.value)}/>}</label>)}</div></section>)}
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm"><h2 className="text-lg font-extrabold text-text-dark">Email notifications</h2><p className="mt-1 text-sm text-text-mid">Choose which automatic emails the platform sends.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{[["emailVerification","Email verification and sign-in OTP"],["orders","New order confirmations"],["payments","Payment notifications"],["orderStatus","Order status updates"]].map(([key,label])=><label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"><span className="text-sm font-semibold text-text-dark">{label}</span><input type="checkbox" role="switch" className="h-5 w-10 accent-[#205493]" checked={Boolean(data.notifications[key])} onChange={e=>update("notifications",key,e.target.checked)}/></label>)}</div></section>
    {message&&<p role="status" className="text-sm font-semibold text-blue">{message}</p>}<Button onClick={save} disabled={saving}>{saving?<LoaderCircle className="animate-spin" size={16}/>:<Save size={16}/>}Save all settings</Button>
  </div>;
}
