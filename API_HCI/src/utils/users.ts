import { User } from "../entities/user";
import { NewUserData, UserData } from "../types/user";
import { getHashedPassword } from "../utils/passwords";

export function mapNewUserDataToEntity(
    newUserData: NewUserData
): User {
    const user: User = new User();
    user.firstName = newUserData.firstName;
    user.lastName = newUserData.lastName;
    user.email = newUserData.email;
    user.password = getHashedPassword(newUserData.password);
    user.birthDate = new Date(newUserData.birthDate);
    user.metadata = newUserData?.metadata;
    return user;
}

export function mapEntityToUserData(
    user: User | null
): UserData {
    if (!user) return;

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate.toISOString().substring(0, 10),
        metadata: user.metadata
    };
}