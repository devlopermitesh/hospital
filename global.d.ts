import { PrismaClient } from "@prisma/client";

enum Role {
  DOCTOR,
  PATIENT,
}

declare global {
  var prismadb: PrismaClient | undefined;
}
declare module "next-auth" {
  interface User {
    id?: string;
    role?: Role;
  }
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: Role;
    };
  }
}
