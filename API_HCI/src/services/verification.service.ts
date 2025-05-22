import { Verification } from "../entities/verification";
import { VerificationType } from "../entities/verificationType";
import { NotFoundError } from "../types/error";

async function findVerification(
    type: VerificationType,
    code: string,
): Promise<Verification> {
    const verification: Verification =
        await Verification.findOne({
            where: {
                type,
                code
            },
            relations: ["user"]
        });
    if (!verification) throw new NotFoundError("Invalid code.");
    return verification;
}

export async function getVerification(
    type: VerificationType,
    code: string,
): Promise<Verification> {
    try {
        return await findVerification(type, code);
    } catch (err: unknown) {
        throw err;
    }

}