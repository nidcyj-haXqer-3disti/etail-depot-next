import {apiRoute,json,readJson} from "@/platform/http/context";
import {getPersonalProfile,updatePersonalProfile} from "@/modules/identity/profile-service";
import {updatePersonalProfileSchema} from "@/shared/personal-profile";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){return apiRoute(request,async session=>json(await getPersonalProfile(session!)),{authenticated:true});}
export async function PUT(request:Request){return apiRoute(request,async session=>json(await updatePersonalProfile(session!,await readJson(request,updatePersonalProfileSchema))),{authenticated:true});}
