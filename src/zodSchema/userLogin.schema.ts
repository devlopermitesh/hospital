import z from "zod";

export  const UserLoginSchema=z.object({
email:z.string().email("Invalid email address"),
password:z.string().min(2,"Enter a valid password").max(40,"Password length should be lesser then 40")
})
export type UserLogin = z.infer<typeof UserLoginSchema>;