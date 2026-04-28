import type { UserInsert, UserRow, UserUpdate } from "@/types/user";
import type { UserAddress, UserGender } from "@/types/user";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: UserInsert;
        Update: UserUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_user_profile: {
        Args: {
          p_address: UserAddress;
          p_date_of_birth: string;
          p_gender: UserGender;
          p_name: string;
        };
        Returns: UserRow;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
