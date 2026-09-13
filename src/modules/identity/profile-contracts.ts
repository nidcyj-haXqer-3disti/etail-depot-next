import {personalProfileSchema,profileUpdateResultSchema,updatePersonalProfileSchema} from "../../shared/personal-profile";
export const profileOperations = [
  {path:"/api/v1/profile",method:"get",response:personalProfileSchema,status:200,authenticated:true},
  {path:"/api/v1/profile",method:"put",request:updatePersonalProfileSchema,response:profileUpdateResultSchema,status:200,authenticated:true},
] as const;
