import { requireAdmin } from "@/server/admin";
import { prisma } from "@/server/db";
import { routeError } from "@/server/http";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){try{await requireAdmin();const {id}=await params;const proof=await prisma.bankTransfer.findUnique({where:{id},select:{proofDataBase64:true,proofMimeType:true,proofFileName:true}});if(!proof)throw new Error("NOT_FOUND");return new Response(Buffer.from(proof.proofDataBase64,"base64"),{headers:{"Content-Type":proof.proofMimeType,"Content-Disposition":`inline; filename="${proof.proofFileName.replace(/["\r\n]/g,"")}"`,"Cache-Control":"no-store"}})}catch(error){return routeError(error)}}
