import { apiRequest } from "@/services/api-requets";
import { Restaurant } from "@/services/types";

// RestaurantsEndpoints
// GET
// /v1/restaurants
// GET
// /v1/restaurants/types
// GET
// /v1/restaurants/{code}/menu/dates
// GET
// /v1/restaurants/{code}/info
// GET
// /v1/restaurants/{code}/menu/{date}
// GET
// /v1/restaurants/{code}/menu/{date}/image
// GET
// /v1/restaurants/{code}
// GET
// /v1/restaurants/{code}/menu

export async function getRestaurants() {
    return apiRequest({
        endpoint: "v1/restaurants",
    });
}

export async function getRestaurantTypes() {
    return apiRequest({
        endpoint: "v1/restaurants/types",
    });
}