// app/types.ts
export interface Item {
  id: number;
  name: string;
  details: string;
}

export interface LoaderData {
  data: Item[];
}

export interface FormFields {
  name: string;
  company: string;
  observation: string;
  type: number;
  status: number;
  clinic: number;
  entryAt: Date;
  confirmedAt?: Date | null;  
  permanence?: number | null;   
}

export interface ActionData {
  formErrors?: Partial<FormFields>;
  formValues?: FormFields;
}
