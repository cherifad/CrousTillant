"use client";

import { ApiResult } from "@/services/types";

/**
 * Makes an API request
 * @param endpoint - API endpoint (relative URL)
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param body - Request body (optional)
 * @param authRequired - Whether authentication is required
 * @returns A promise that resolves to ApiResult containing either data or error
 */
export async function apiRequest<T>({
    endpoint,
    method = "GET",
    body,
    authRequired = false,
}: {
    endpoint: string;
    method?: string;
    body?: any;
    authRequired?: boolean;
}): Promise<ApiResult<T>> {
    const url = `${process.env.BACKEND_URL}/${endpoint}`;
    const headers: HeadersInit = {};

    // Add Authorization header if authRequired is true
    // if (authRequired) {
    //     const session = await getServerSession(options);
    //     if (!session) {
    //         return {
    //             success: false,
    //             error: "Frontend - Unauthorized access: No session found",
    //             status: 401,
    //         };
    //     }
    //     headers.Authorization = `Bearer ${session.user.token}`;
    // }

    try {
        let bodyContent = undefined;

        if (body) {
            bodyContent = body instanceof FormData ? body : JSON.stringify(body);
        }

        if (!(body instanceof FormData) && body) {
            headers["Content-Type"] = "application/json";
        }

        console.log("Requesting", url, method, headers, bodyContent);

        const response = await fetch(url, {
            method,
            headers: headers,
            body: bodyContent,
        });

        console.log("Response", response);

        // Handle the case of 204 No Content
        if (response.status === 204) {
            return {
                success: true,
                data: undefined as unknown as T, // No data returned, but marked as successful
            };
        }

        // If the response is OK, return the data
        if (response.ok) {
            const data: T = await response.json();
            return {
                success: true,
                data,
            };
        }

        // If the response is not OK, return an error
        return {
            success: false,
            error: `Error ${method} ${endpoint}: ${response.statusText}`,
            status: response.status,
        };
    } catch (err) {
        // Handle network errors or unexpected issues
        return {
            success: false,
            error: `Network or server error: ${err instanceof Error ? err.message : String(err)}`,
            status: 500, // Generic status for network failures
        };
    }
}