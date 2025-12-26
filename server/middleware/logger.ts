import { Request, Response, NextFunction } from "express";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const { method, url, body, query } = req;

    console.log(`[REQUEST] ${method} ${url}`);
    if (Object.keys(query).length > 0) console.log("Query:", query);
    if (method !== "GET" && Object.keys(body).length > 0) console.log("Body:", body);

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[RESPONSE] ${method} ${url} ${res.statusCode} - ${duration}ms`);
    });

    next();
};

export default requestLogger;
