

export interface RegisterUserPayload {
   name : string;
   email : string;
   password : string;
   profilePhoto? : string;
   bio? : string;
   role? : UserRole;
}

enum UserRole {
   USER = "USER",
   AUTHOR = "AUTHOR"
}