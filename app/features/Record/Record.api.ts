import { Record } from "@prisma/client";
import { FormFields } from "~/types";
import { db } from "~/utils/db.server";
import { Status } from "~/enumerators/Status";

interface Search {
    clinic?: number | null;
    status?: number[] | null; // Permite uma lista de números ou null
    startDate?: Date | null;
    endDate?: Date | null;
}

export async function getRecords(): Promise<Record[]> {
    return db.record.findMany({
        orderBy: {
            entryAt: 'desc', 
        },
    });
}

export async function getRecordsByClinic(clinic: number): Promise<Record[]> {
    return db.record.findMany({
        where: {
            clinic: clinic,
        },
        orderBy: {
            entryAt: 'desc', 
        },
    });
}

export async function getRecord(id: string): Promise<Record | null> {
    return db.record.findUnique({
        where: {
            id,
        },
    });
}

export async function saveRecord(data: FormFields, id?: string): Promise<Record> {
    if (id) {
        const existingRecord = await db.record.findUnique({ where: { id } });
        if (!existingRecord) {
            throw new Error('Registro não encontrado.');
        }
        return db.record.update({
            where: { id },
            data,
        });
    }

    return db.record.create({
        data,
    });
}

export async function deleteRecord(id: string): Promise<void> {
    const existingRecord = await db.record.findUnique({ where: { id } });
    if (!existingRecord) {
        throw new Error('Registro não encontrado.');
    }

    await db.record.delete({ where: { id } });
}

export async function confirmRecord(id: string): Promise<Record | null> {
    const record = await db.record.findUnique({
        where: { id },
        select: { entryAt: true, status: true },
    });

    if (!record) {
        throw new Error('Registro não encontrado.');
    }

    if (record.status === Status.CONCLUIDO) {
        throw new Error('Registro já está concluído.');
    }

    const currentDate = new Date();
    const entryDate = new Date(record.entryAt);

    if (currentDate < entryDate) {
        throw new Error('A data da baixa não pode ser anterior à data de entrada.');
    }

    const permanenceSeconds = Math.floor((currentDate.getTime() - entryDate.getTime()) / 1000);

    return db.record.update({
        where: { id },
        data: {
            status: Status.CONCLUIDO,
            confirmedAt: currentDate,
            permanence: permanenceSeconds,
        },
    });
}

export async function searchRecords({
    clinic,
    status,
    startDate,
    endDate,
}: Search): Promise<Record[]> {
    const filters: any = {};

    if (clinic) {
        filters.clinic = clinic;
    }

    if (status) {
        filters.status = {
            in: status, // Ajusta para aceitar uma lista de status
        };
    }

    if (startDate) {
        filters.entryAt = {
            ...(filters.entryAt || {}),
            gte: startDate,
        };
    }

    if (endDate) {
        filters.entryAt = {
            ...(filters.entryAt || {}),
            lte: endDate,
        };
    }

    return db.record.findMany({
        where: filters,
        orderBy: {
            entryAt: 'desc',
        },
    });
}
