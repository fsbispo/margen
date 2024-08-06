import { Record } from '@prisma/client';
import { Clinic } from '~/enumerators/Clinic';
import { ExamType } from '~/enumerators/ExamType';
import { ExamText } from '~/enumerators/ExamType';
import { Status } from '~/enumerators/Status';
import { RecordResponse } from '~/interfaces/IRecord';
import { secondsToHHMMSS } from '~/util';
import { formatDate } from '~/util';

const mapClinic = (clinic: number): string => {
    switch (clinic) {
        case Clinic.JACAREI:
            return 'Jacareí';
        case Clinic.SJC:
            return 'São José dos Campos';
        default:
            return '';
    }
};

const mapType = (type: number): string => {
    switch (type) {
        case ExamType.EXAME_CLINICO:
            return ExamText[ExamType.EXAME_CLINICO];
        case ExamType.COMPLEMENTARES:
            return ExamText[ExamType.COMPLEMENTARES];
        case ExamType.EXAME_SIMPLES:
            return ExamText[ExamType.EXAME_SIMPLES];
        default:
            return '';
    }
};

const mapStatus = (status: number): string => {
    switch (status) {
        case Status.PENDENTE:
            return 'Pendente';
        case Status.CONCLUIDO:
            return 'Concluído';
        default:
            return '';
    }
};

const mapRecord = (record: Record): RecordResponse => {
    return {
        id: record.id,
        name: record.name,
        company: record.company,
        observation: record.observation,
        type: mapType(record.type),
        status: mapStatus(record.status),
        intStatus: record.status,
        clinic: mapClinic(record.clinic),
        entryAt: new Date(record.entryAt),
        entryAtString: formatDate(new Date(record.entryAt)),
        confirmedAt: record.confirmedAt ? new Date(record.confirmedAt) : null,
        confirmedAtString: record.confirmedAt ? formatDate(new Date(record.confirmedAt)) : '',
        permanence: record.permanence ? secondsToHHMMSS(record.permanence) : '',
    };
};

const mapRecords = (records: any[]): RecordResponse[] => {
    return records.map(mapRecord);
};

export { mapRecords };
