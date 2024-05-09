"use client";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ListFilter, CircleX } from 'lucide-react';
import { useState } from "react";

interface Filter {
    id: number;
    name: string;
}

export default function Filters() {
    const [filters, setFilters] = useState<Filter[]>([
        { id: 1, name: "Filtre 1" },
        { id: 2, name: "Filtre 2" },
        { id: 3, name: "Filtre 3" },
    ]);
    return (
        <div className="flex gap-2 mt-4 md:mt-8">
            <Drawer>
                <DrawerTrigger>
                    <Button variant="outline">
                        <ListFilter className="h-4 w-4 mr-2" />
                        Filtres
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <ul className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                    <li key={filter.id}>
                        <Button>
                            {filter.name}
                            <CircleX className="h-4 w-4 ml-2 hover:text-red-500 transition-colors" onClick={() => setFilters(filters.filter((f) => f.id !== filter.id))} />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}