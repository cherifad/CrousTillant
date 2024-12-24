export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; status: number };

export type Restaurant = {
    acces: string[]; // Accès (ex : lignes de bus)
    adresse: string; // Adresse du restaurant
    code: number; // Code du restaurant
    email: string | null; // Adresse email (peut être null)
    horaires: string[]; // Horaires d'ouverture
    image_url: string | null; // URL de l'image (peut être null)
    ispmr: boolean; // Accessibilité PMR (Personnes à Mobilité Réduite)
    jours_ouvert: {
        jour: string; // Jour d'ouverture (ex : "Lundi")
        ouverture: {
            matin: boolean; // Ouverture le matin
            midi: boolean; // Ouverture à midi
            soir: boolean; // Ouverture le soir
        };
    }[]; // Liste des jours ouverts avec leurs plages horaires
    latitude: number; // Latitude du restaurant
    longitude: number; // Longitude du restaurant
    nom: string; // Nom du restaurant
    paiement: string[]; // Moyens de paiement acceptés
    region: {
        code: number; // Code de la région
        libelle: string; // Libellé de la région
    };
    telephone: string | null; // Numéro de téléphone (peut être null)
    type_restaurant: {
        code: number; // Code du type de restaurant
        libelle: string; // Libellé du type de restaurant
    };
    zone: string; // Zone du restaurant
};
