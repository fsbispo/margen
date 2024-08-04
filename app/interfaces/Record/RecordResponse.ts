export interface RecordResponse {
    id: string;
    name: string;
    company: string;
    observation: string;
    type: string;
    status: string;
    clinic: string;
    entryAt: Date;
    confirmedAt?: Date | null;  
    permanence: String;
}
  