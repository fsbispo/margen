import { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import bcryptjs from 'bcryptjs';
const { hash } = bcryptjs;

export async function getUserByName(name: string): Promise<User | null> {
    return await db.user.findUnique({
        where: { name }
    });
}

export async function getUsers(): Promise<Pick<User, "id" | "name" | 'type'>[]> {
    return await db.user.findMany({
        select: {
            id: true,
            name: true,
            type: true
        }
    });
}

export async function createUser(name: string, password: string, type: number) {
    const hashedPassword = await hash(password, 10);
    return await db.user.create({
        data: {
            name,
            password: hashedPassword,
            type
        }
    });
}

export async function updateUser(id: string, name: string, password: string, type: number) {
    const hashedPassword = password ? await hash(password, 10) : undefined;
    return await db.user.update({
        where: { id },
        data: {
            name,
            ...(hashedPassword && { password: hashedPassword }),
            type
        }
    });
}



