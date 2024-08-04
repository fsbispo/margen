import { Record } from "@prisma/client";
import { FormFields } from "~/types";
import { db } from "~/utils/db.server";

export async function getRecords(): Promise<Record[]> {
    return await db.record.findMany({
        orderBy: {
            entryAt: 'desc', 
        },
    });
}

export async function getRecordsByClinic(clinic: number): Promise<Record[]> {
    return await db.record.findMany({
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
        return db.record.update({
        where: { id },
        data,
        });
    }

    return db.record.create({
        data,
    });
}

export async function deleteRecord(id: string): Promise<Record> {
    return db.record.delete({ where: { id } });
}

export async function confirmRecord(id: string): Promise<Record | null> {
    const record = await db.record.findUnique({
        where: { id },
        select: { entryAt: true },
    });

    if (!record) {
        return null;
    }

    const currentDate = new Date();
    const permanenceSeconds = Math.floor((currentDate.getTime() - new Date(record.entryAt).getTime()) / 1000);

    return await db.record.update({
        where: { id },
        data: {
            status: 1,
            confirmedAt: currentDate,
            permanence: permanenceSeconds,
        },
    });
}

