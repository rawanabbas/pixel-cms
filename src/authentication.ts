import { Request } from "express";

export function expressAuthentication(
    req: Request,
    securityName: string,
    scopes?: string
): Promise<any> {
    if (securityName === "sessionAuth") {
        if (req.session?.user) {
            return Promise.resolve();
        }
        return Promise.reject({ status: 401 });
    }
    return Promise.resolve();
}
