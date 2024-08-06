export interface RecordResponse {
    id: String;
    name: String;
    company: String;
    observation: String;
    type: String;
    status: String;
    intStatus: number;
    clinic: String;
    entryAt: Date;
    entryAtString: String;
    confirmedAt?: Date | null;  
    confirmedAtString: String;
    permanence: String;
}
  

export interface SearchRecord {
    startDate: Date;
    endDate: Date;
    clinic: number;
    status: number[];
}