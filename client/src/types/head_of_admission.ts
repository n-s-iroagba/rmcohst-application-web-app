interface HeadOfAdmissionsAttributes {
  id: number;
  staffId: number;
  email:string
  portalUsername: string;
  portalPassword: string;
}

export type HeadOfAdmissionsCreationAttributes =Omit<HeadOfAdmissionsAttributes, 'id'>
